import type { Metadata } from "next";
import { auth } from "@repo/auth/server";

const title = "Acme Inc";
const description = "My application.";

export const metadata: Metadata = {
  title,
  description,
};

const App = async () => {
  const { userId } = await auth();

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <h1 className="text-2xl font-bold">Welcome!</h1>
      <p className="mt-2 text-muted-foreground">
        You are signed in as {userId}
      </p>
    </div>
  );
};

export default App;
