import { NextRequest, NextResponse } from "next/server";
import { getDb, resumes } from "@jobplatform/shared/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/auth-options";
import { saveResume } from "../store";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

function getFileFormat(file: File): "pdf" | "docx" | "txt" | null {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return "pdf";
  if (extension === "docx") return "docx";
  if (extension === "txt") return "txt";

  if (ALLOWED_TYPES.includes(file.type)) {
    if (file.type === "application/pdf") return "pdf";
    if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") return "docx";
    return "txt";
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as Record<string, unknown>).id as string;

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileFormat = getFileFormat(file);
    if (!fileFormat) {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF, DOCX, or TXT file." },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "The uploaded file is empty." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { parseResume } = await import("@jobplatform/shared/lib/resume/parser");
    const { extractResumeData } = await import("@jobplatform/shared/lib/resume/extractor");

    const extension = file.name.lastIndexOf(".");
    const parserFilename = extension > 0
      ? `${file.name.slice(0, extension)}.${fileFormat}`
      : `resume.${fileFormat}`;
    let parsed;
    try {
      parsed = await parseResume(buffer, parserFilename);
    } catch (error) {
      const details = error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack, cause: error.cause }
        : { value: String(error) };
      console.error("[resume/upload] Resume parsing failed:", details);
      return NextResponse.json(
        {
          error:
            fileFormat === "pdf"
              ? "We could not read this PDF. Please upload a text-based, non-password-protected PDF."
              : fileFormat === "docx"
                ? "We could not read this DOCX file. Please make sure it opens correctly in Word and try again."
                : "We could not read this text file. Please check the file and try again.",
          debug: details.message,
        },
        { status: 400 },
      );
    }
    const wordCount = parsed.text.split(/\s+/).filter(Boolean).length;
    
    const extractedData = extractResumeData(parsed.text);
    
    // Store original file as base64 for later download
    const originalFileContent = buffer.toString('base64');

    // Try to persist to database; fall back to in-memory store
    const db = getDb();
    let resumeId: string;

    if (db) {
      try {
        const [inserted] = await db
          .insert(resumes)
          .values({
            userId,
            originalFilePath: file.name,
            parsedText: parsed.text,
          })
          .returning({ id: resumes.id });
        resumeId = inserted!.id;
      } catch (e) {
        console.warn("[resume/upload] DB insert failed, falling back to in-memory store:", e);
        const stored = saveResume(userId, file.name, parsed.format, parsed.text, wordCount, originalFileContent);
        resumeId = stored.id;
      }
    } else {
      const stored = saveResume(userId, file.name, parsed.format, parsed.text, wordCount, originalFileContent);
      resumeId = stored.id;
    }

    return NextResponse.json({
      id: resumeId,
      filename: file.name,
      size: file.size,
      format: parsed.format,
      text: parsed.text,
      sections: parsed.sections,
      wordCount,
      extractedData,
    });
  } catch (e) {
    console.error("[resume/upload] Unhandled error:", e);
    if (e instanceof Error) {
      console.error("[resume/upload] Stack:", e.stack);
      console.error("[resume/upload] Cause:", (e as any).cause);
    }
    return NextResponse.json(
      {
        error: "An unexpected error occurred while processing your resume.",
        debug: e instanceof Error ? e.message : String(e),
      },
      { status: 500 },
    );
  }
}
