import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Verify Resend configuration
export async function verifyEmailConfig() {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is not set in environment variables");
      return false;
    }
    console.log("✅ Resend email service is configured");
    return true;
  } catch (error) {
    console.error("❌ Email configuration error:", error);
    return false;
  }
}

// Send email function using Resend
export async function sendEmail({ to, subject, html }) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM || "SunMoonie <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log("📧 Email sent successfully:", data.id);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("❌ Email sending error:", error);
    return { success: false, error: error.message };
  }
}

export default resend;
