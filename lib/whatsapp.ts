import { toWhatsAppDigits } from "@/lib/utils";

type SendWhatsAppTextMessageInput = {
  to: string;
  body: string;
};

type SendWhatsAppTextMessageResult =
  | {
      sent: true;
      messageId?: string;
    }
  | {
      sent: false;
      error: string;
    };

export async function sendWhatsAppTextMessage({
  to,
  body,
}: SendWhatsAppTextMessageInput): Promise<SendWhatsAppTextMessageResult> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const apiVersion = process.env.WHATSAPP_API_VERSION?.trim() || "v20.0";

  if (!accessToken || !phoneNumberId) {
    return {
      sent: false,
      error:
        "WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID must be configured.",
    };
  }

  const response = await fetch(
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: toWhatsAppDigits(to),
        type: "text",
        text: {
          body,
          preview_url: false,
        },
      }),
    },
  );

  const data = (await response.json().catch(() => null)) as
    | {
        messages?: { id?: string }[];
        error?: { message?: string };
      }
    | null;

  if (!response.ok) {
    return {
      sent: false,
      error:
        data?.error?.message ??
        `WhatsApp API request failed with status ${response.status}.`,
    };
  }

  return {
    sent: true,
    messageId: data?.messages?.[0]?.id,
  };
}
