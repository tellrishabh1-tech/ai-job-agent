export type OutreachLogRecord = Record<string, unknown>;

const globalStore = globalThis as typeof globalThis & {
  __outreachLogs?: OutreachLogRecord[];
};

export const outreachLogs = globalStore.__outreachLogs ?? (globalStore.__outreachLogs = []);
