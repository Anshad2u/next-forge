import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface PaymentConfirmationProperties {
  readonly name: string;
  readonly amount: string;
  readonly plan: string;
  readonly invoiceUrl?: string;
}

export const PaymentConfirmation = ({
  name,
  amount,
  plan,
  invoiceUrl,
}: PaymentConfirmationProperties) => (
  <Tailwind>
    <Html>
      <Head />
      <Preview>Payment confirmation</Preview>
      <Body className="bg-white font-sans">
        <Container className="mx-auto py-5 pb-12">
          <Text className="text-2xl font-bold">Payment Received</Text>
          <Text className="text-base">
            Hi {name}, we've received your payment of {amount} for the {plan} plan.
          </Text>
          {invoiceUrl && (
            <Section className="my-6">
              <Text className="text-base">
                <a href={invoiceUrl} className="text-blue-600 underline">
                  View your invoice
                </a>
              </Text>
            </Section>
          )}
          <Hr />
          <Text className="text-sm text-gray-500">
            Thank you for your business!
          </Text>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);
