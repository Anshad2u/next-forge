import { WrenchIcon } from "lucide-react";

const MaintenancePage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
    <WrenchIcon className="h-16 w-16 text-muted-foreground" />
    <h1 className="text-3xl font-bold tracking-tight">
      Under Maintenance
    </h1>
    <p className="max-w-md text-center text-muted-foreground">
      We&apos;re performing scheduled maintenance. We&apos;ll be back shortly.
    </p>
  </div>
);

export default MaintenancePage;
