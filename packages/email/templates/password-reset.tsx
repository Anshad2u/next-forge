import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProperties {
  readonly resetLink: string;
  readonly userName?: string;
}

export const PasswordResetEmail = ({
  resetLink,
  userName,
}: PasswordResetEmailProperties) => (
  <Html>
    <Head />
    <Preview>Reset your password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reset your password</Heading>
        <Text style={text}>
          {userName ? `Hi ${userName},` : "Hello,"}
        </Text>
        <Text style={text}>
          We received a request to reset your password. Click the button below
          to set a new password. This link will expire in 1 hour.
        </Text>
        <Section style={buttonContainer}>
          <Button href={resetLink} style={button}>
            Reset Password
          </Button>
        </Section>
        <Text style={text}>
          If you didn&apos;t request a password reset, you can safely ignore
          this email.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          <Link href={resetLink} style={link}>
            {resetLink}
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "0",
  margin: "30px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#000",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

const link = {
  color: "#8898aa",
  textDecoration: "underline",
};

export default PasswordResetEmail;
