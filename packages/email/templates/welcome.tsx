import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface WelcomeEmailProperties {
  readonly name: string;
  readonly email: string;
}

export const WelcomeEmail = ({ name, email }: WelcomeEmailProperties) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>Welcome to our platform!</Preview>
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-5 pb-12">
          <Text className="text-2xl font-bold">Welcome, {name}!</Text>
          <Text className="text-base">
            Thanks for signing up with {email}. We're excited to have you on board.
          </Text>
          <Text className="text-base">
            Get started by exploring your dashboard and setting up your profile.
          </Text>
          <Section className="my-6">
            <Button
              className="rounded bg-black px-6 py-3 text-center text-sm font-medium text-white"
              href={process.env.NEXT_PUBLIC_APP_URL || "https://example.com"}
            >
              Go to Dashboard
            </Button>
          </Section>
          <Hr />
          <Text className="text-sm text-gray-500">
            If you have any questions, just reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);
