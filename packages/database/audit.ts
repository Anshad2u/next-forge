import { database } from "./index";

interface AuditLogEntry {
  userId: string;
  action: string;
  resource?: string;
  details?: string;
  ipAddress?: string;
}

export const logAuditEvent = async (entry: AuditLogEntry) => {
  try {
    await database.auditLog.create({
      data: {
        userId: entry.userId,
        action: entry.action,
        resource: entry.resource,
        details: entry.details,
        ipAddress: entry.ipAddress,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
};

export const getAuditLogs = async (
  userId?: string,
  limit = 50,
  offset = 0
) => {
  const where = userId ? { userId } : {};
  return database.auditLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
};
