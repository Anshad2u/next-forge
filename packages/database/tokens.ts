import { database } from "./index";

const PLAN_LIMITS: Record<string, number> = {
  free: 1000,
  pro: 50000,
  enterprise: 500000,
};

export const trackTokenUsage = async (
  userId: string,
  tokens: number,
  feature: string
) => {
  await database.tokenUsage.create({
    data: { userId, tokens, feature },
  });
};

export const getTokenUsage = async (userId: string, period = "month") => {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case "day":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "month":
    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
  }

  const result = await database.tokenUsage.aggregate({
    where: {
      userId,
      createdAt: { gte: startDate },
    },
    _sum: { tokens: true },
  });

  return result._sum.tokens || 0;
};

export const getRemainingTokens = async (userId: string, plan: string) => {
  const used = await getTokenUsage(userId);
  const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  return Math.max(0, limit - used);
};

export const hasTokensRemaining = async (userId: string, plan: string) => {
  const remaining = await getRemainingTokens(userId, plan);
  return remaining > 0;
};

export const getPlanLimits = () => PLAN_LIMITS;
