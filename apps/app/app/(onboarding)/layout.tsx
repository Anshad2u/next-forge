import type { ReactNode } from "react";

interface OnboardingLayoutProps {
  readonly children: ReactNode;
}

const OnboardingLayout = ({ children }: OnboardingLayoutProps) => (
  <div className="min-h-screen bg-muted/50">{children}</div>
);

export default OnboardingLayout;
