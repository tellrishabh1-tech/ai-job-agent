import mammoth from "mammoth";

export interface ParsedResume {
  text: string;
  sections: ResumeSection[];
  format: "pdf" | "docx" | "txt";
}

export interface ResumeSection {
  heading: string;
  content: string;
}

class NodeDOMMatrix {
  a = 1;
  b = 0;
  c = 0;
  d = 1;
  e = 0;
  f = 0;

  constructor(value?: number[] | Partial<NodeDOMMatrix>) {
    if (Array.isArray(value)) {
      [this.a, this.b, this.c, this.d, this.e, this.f] = value;
    } else if (value) {
      Object.assign(this, value);
    }
  }

  multiplySelf(other: NodeDOMMatrix) {
    const left = new NodeDOMMatrix(this);
    this.a = left.a * other.a + left.c * other.b;
    this.b = left.b * other.a + left.d * other.b;
    this.c = left.a * other.c + left.c * other.d;
    this.d = left.b * other.c + left.d * other.d;
    this.e = left.a * other.e + left.c * other.f + left.e;
    this.f = left.b * other.e + left.d * other.f + left.f;
    return this;
  }

  preMultiplySelf(other: NodeDOMMatrix) {
    const current = new NodeDOMMatrix(this);
    Object.assign(this, new NodeDOMMatrix(other).multiplySelf(current));
    return this;
  }

  translateSelf(x: number, y = 0) {
    return this.multiplySelf(new NodeDOMMatrix([1, 0, 0, 1, x, y]));
  }

  scaleSelf(x: number, y = x) {
    return this.multiplySelf(new NodeDOMMatrix([x, 0, 0, y, 0, 0]));
  }

  invertSelf() {
    const determinant = this.a * this.d - this.b * this.c;
    if (!determinant) throw new Error("Cannot invert a singular matrix");
    const { a, b, c, d, e, f } = this;
    this.a = d / determinant;
    this.b = -b / determinant;
    this.c = -c / determinant;
    this.d = a / determinant;
    this.e = (c * f - d * e) / determinant;
    this.f = (b * e - a * f) / determinant;
    return this;
  }

  translate(x: number, y = 0) {
    return new NodeDOMMatrix(this).translateSelf(x, y);
  }

  scale(x: number, y = x) {
    return new NodeDOMMatrix(this).scaleSelf(x, y);
  }
}

const SECTION_HEADINGS = [
  /^(education|academic|qualifications?)/i,
  /^(experience|work\s*experience|employment|professional\s*experience)/i,
  /^(skills|technical\s*skills|core\s*competencies|technologies)/i,
  /^(projects?|personal\s*projects?|open\s*source)/i,
  /^(certifications?|licenses?|credentials?)/i,
  /^(summary|professional summary|objective|profile|about me)/i,
  /^(publications?|research|papers?)/i,
  /^(languages?)/i,
  /^(awards?|honors?|achievements?)/i,
  /^(volunteering|volunteer|community)/i,
  /^(references?)/i,
];

export async function parseResume(
  buffer: Buffer,
  filename: string,
): Promise<ParsedResume> {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "pdf") {
    return parsePDF(buffer);
  }
  if (ext === "docx") {
    return parseDOCX(buffer);
  }
  return parseText(buffer);
}

async function parsePDF(buffer: Buffer): Promise<ParsedResume> {
  // PDF.js may access DOMMatrix while its Node bundle is being initialized.
  // Node does not provide that browser API. Text extraction only needs the
  // affine matrix operations below, so keep this fallback dependency-free.
  if (typeof globalThis.DOMMatrix === "undefined") {
    globalThis.DOMMatrix = NodeDOMMatrix as unknown as typeof globalThis.DOMMatrix;
  }

  const [{ PDFParse }, { default: workerSrc }] = await Promise.all([
    import("pdf-parse"),
    import("pdf-parse/worker"),
  ]);
  PDFParse.setWorker(workerSrc);

  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    const trimmedText = (result.text ?? "").trim();

    return {
      text: trimmedText,
      sections: extractSections(trimmedText),
      format: "pdf",
    };
  } finally {
    await parser.destroy().catch(() => undefined);
  }
}

async function parseDOCX(buffer: Buffer): Promise<ParsedResume> {
  const result = await mammoth.extractRawText({ buffer });
  return {
    text: result.value,
    sections: extractSections(result.value),
    format: "docx",
  };
}

function parseText(buffer: Buffer): ParsedResume {
  const text = buffer.toString("utf-8");
  return {
    text,
    sections: extractSections(text),
    format: "txt",
  };
}

export function extractSections(text: string): ResumeSection[] {
  const lines = text.split("\n");
  const sections: ResumeSection[] = [];
  let currentHeading = "general";
  let currentContent: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const matched = SECTION_HEADINGS.find((re) => re.test(trimmed));
    if (matched) {
      if (currentContent.length > 0) {
        sections.push({
          heading: currentHeading,
          content: currentContent.join("\n").trim(),
        });
        currentContent = [];
      }
      currentHeading = trimmed;
    } else {
      currentContent.push(trimmed);
    }
  }

  if (currentContent.length > 0) {
    sections.push({
      heading: currentHeading,
      content: currentContent.join("\n").trim(),
    });
  }

  return sections;
}
