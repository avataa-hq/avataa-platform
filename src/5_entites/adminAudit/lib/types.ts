export const auditPageOptions = ['Configuration audit', 'Data audit', 'Session audit'] as const;

export type AuditOptionsType = (typeof auditPageOptions)[number];
