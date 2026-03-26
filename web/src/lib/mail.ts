import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const confirmLink = `${baseUrl}/api/verify?token=${token}`;

  await resend.emails.send({
    from: 'Dream Blelma <onboarding@resend.dev>',
    to: email,
    subject: 'Confirm your account - Dream Blelma',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Welcome to Blelma Dream!</h2>
        <p>Please click the link below to confirm your account:</p>
        <a href="${confirmLink}" style="padding: 10px 20px; background: #0c4a6e; color: white; text-decoration: none; borderRadius: 5px;">
          Confirm Account
        </a>
      </div>
    `
  });
}
