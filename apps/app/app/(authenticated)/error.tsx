"use client";

interface ErrorProperties {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

const AuthenticatedError = ({ error, reset }: ErrorProperties) => (
  <div className="flex flex-col items-center justify-center p-8">
    <h1 className="text-2xl font-bold">Something went wrong</h1>
    <p className="mt-2 text-muted-foreground">
      {error.message}
      {error.digest && <span> (digest: {error.digest})</span>}
    </p>
    <button
      className="mt-4 rounded bg-primary px-4 py-2 text-primary-foreground"
      onClick={() => reset()}
    >
      Try again
    </button>
  </div>
);

export default AuthenticatedError;
