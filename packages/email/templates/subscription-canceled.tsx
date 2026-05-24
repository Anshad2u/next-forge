import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface SubscriptionCanceledEmailProperties {
  readonly userName?: string;
  readonly planName: string;
}

export const SubscriptionCanceledEmail = ({
  userName,
  planName,
}: SubscriptionCanceledEmailProperties) => (
  <Html>
    <Head />
    <Preview>Your subscription has been canceled</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Subscription Canceled</Heading>
        <Text style={text}>
          {userName ? `Hi ${userName},` : "Hello,"}
        </Text>
        <Text style={text}>
          Your <strong>{planName}</strong> subscription has been canceled. You
          will continue to have access until the end of your current billing
          period.
        </Text>
        <Text style={text}>
          If you change your mind, you can resubscribe at any time from your
          billing settings.
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          If you have any questions, please contact our support team.
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

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

export default SubscriptionCanceledEmail;
