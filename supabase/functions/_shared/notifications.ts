const DEFAULT_SMS_GATEWAY = 'https://api.twilio.com/2010-04-01/Accounts';

export interface SmsPayload {
  to: string;
  message: string;
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

export async function sendSms(payload: SmsPayload): Promise<{ ok: boolean; providerMessageId?: string; error?: string }> {
  const sid = Deno.env.get('TWILIO_ACCOUNT_SID');
  const token = Deno.env.get('TWILIO_AUTH_TOKEN');
  const from = Deno.env.get('TWILIO_FROM_NUMBER');
  const gateway = Deno.env.get('TWILIO_API_BASE') || DEFAULT_SMS_GATEWAY;

  if (!sid || !token || !from) {
    return { ok: false, error: 'Missing TWILIO credentials' };
  }

  const body = new URLSearchParams({
    To: payload.to,
    From: from,
    Body: payload.message,
  });

  try {
    const response = await fetch(`${gateway}/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: `Twilio error: ${text}` };
    }

    const data = (await response.json()) as { sid?: string };
    return { ok: true, providerMessageId: data.sid };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown SMS error' };
  }
}

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; providerMessageId?: string; error?: string }> {
  const resendKey = Deno.env.get('RESEND_API_KEY');
  const from = Deno.env.get('RESEND_FROM_EMAIL') || 'Remote Check <notifications@remote-check.app>';

  if (!resendKey) {
    return { ok: false, error: 'Missing RESEND_API_KEY' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [payload.to],
        subject: payload.subject,
        html: payload.html,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: `Resend error: ${text}` };
    }

    const data = (await response.json()) as { id?: string };
    return { ok: true, providerMessageId: data.id };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown email error' };
  }
}
