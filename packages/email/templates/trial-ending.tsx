import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface TrialEndingEmailProps {
  name?: string;
  daysLeft?: number;
  upgradeUrl?: string;
}

export const TrialEndingEmail = ({
  name = "there",
  daysLeft = 3,
  upgradeUrl = "https://example.com/billing",
}: TrialEndingEmailProps) => (
  <Html>
    <Head />
    <Preview>Your trial is ending in {daysLeft} days</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your trial is ending soon</Heading>
        <Text style={text}>Hi {name},</Text>
        <Text style={text}>
          Your free trial will end in {daysLeft} days. To continue using all
          features, please upgrade to a paid plan.
        </Text>
        <Section style={ctaContainer}>
          <Link href={upgradeUrl} style={button}>
            Upgrade Now
          </Link>
        </Section>
        <Text style={text}>
          If you have any questions, feel free to reply to this email.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default TrialEndingEmail;

const main: React.CSSProperties = {
  backgroundColor: "#f6f9fc",
  fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const h1: React.CSSProperties = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "0 40px",
};

const text: React.CSSProperties = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  padding: "0 40px",
};

const ctaContainer: React.CSSProperties = {
  padding: "24px 40px",
};

const button: React.CSSProperties = {
  backgroundColor: "#000",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  display: "inline-block",
  padding: "12px 24px",
};
