import { Resend } from "resend";
import type { ReactElement } from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = process.env.EMAIL_FROM ?? "Efektif <noreply@efektif.net>";

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  template: ReactElement;
}

export async function sendEmail({ to, subject, template }: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: Array.isArray(to) ? to : [to],
      subject,
      react: template,
    });

    if (error) {
      console.error("[email] Send failed:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[email] Send error:", message);
    return { success: false, error: message };
  }
}
