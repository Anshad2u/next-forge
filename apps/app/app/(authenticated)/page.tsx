import type { Metadata } from "next";
import { auth } from "@repo/auth/server";
import { database, type Page } from "@repo/database";
import { log } from "@repo/observability/log";
import { secure } from "@repo/security";

const title = "Acme Inc";
const description = "My application.";

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const { userId, orgId } = await auth();

  let pages: Page[] = [];
  let error: string | null = null;

  try {
    await secure();
  } catch {
    log.warn("Arcjet secure check failed");
  }

  try {
    pages = await database.page.findMany({ take: 10 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    error = msg;
    log.error("DB error: " + msg);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold tracking-tight">Welcome!</h1>
      <p className="text-muted-foreground">
        You are signed in as {userId}
      </p>
      {!orgId && (
        <p className="text-sm text-amber-500">
          No organization selected
        </p>
      )}
      {error && (
        <p className="text-sm text-red-500">DB error: {error}</p>
      )}
      {pages.length > 0 && (
        <ul className="text-sm text-muted-foreground">
          {pages.map((page) => (
            <li key={page.id}>{page.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
