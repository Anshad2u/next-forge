"use server";

import { requireAdmin } from "@/lib/admin";
import { database } from "@repo/database";

export const updateSetting = async (key: string, value: string) => {
  await requireAdmin();

  await database.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
};
