import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// ─── Supabase Admin Client (service role, server-only) ───────────────────────
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ─── Gmail SMTP Transporter ───────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password (16 chars)
    },
  });
}

// ─── Generate cryptographically random 6-digit code ─────────────────────────
function generateOtp(): string {
  const min = 100000;
  const max = 999999;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

// ─── Rate limiting: max 3 requests per 10 minutes per email ──────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(email: string): boolean {
  const now = Date.now();
  const key = email.toLowerCase();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }

  if (entry.count >= 3) return false;

  entry.count++;
  return true;
}

// ─── POST /api/auth/send-otp ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ── 1. Only the configured admin email is allowed ──
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Server misconfiguration: ADMIN_EMAIL not set' },
        { status: 500 }
      );
    }

    if (normalizedEmail !== adminEmail) {
      // Return generic error to avoid exposing which emails are admin
      return NextResponse.json(
        { error: 'Email not authorized' },
        { status: 403 }
      );
    }

    // ── 2. Rate limiting ──
    if (!checkRateLimit(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    // ── 3. Invalidate any existing unused codes for this email ──
    await supabaseAdmin
      .from('admin_otp_codes')
      .update({ used: true })
      .eq('email', normalizedEmail)
      .eq('used', false);

    // ── 4. Generate new OTP code ──
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // ── 5. Store OTP in Supabase ──
    const { error: dbError } = await supabaseAdmin
      .from('admin_otp_codes')
      .insert({ email: normalizedEmail, code, expires_at: expiresAt, used: false });

    if (dbError) {
      console.error('[send-otp] DB insert error:', dbError);
      return NextResponse.json({ error: 'Failed to generate code. Try again.' }, { status: 500 });
    }

    // ── 6. Send OTP via Gmail ──
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Portfolio Admin" <${process.env.GMAIL_USER}>`,
      to: normalizedEmail,
      subject: '🔐 Your Admin Login Code',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0;padding:0;background-color:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 20px;">
              <tr>
                <td align="center">
                  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center;">
                        <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:16px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px;">
                          <span style="font-size:28px;">🔐</span>
                        </div>
                        <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Admin Login Code</h1>
                        <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">Portfolio CMS Access</p>
                      </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                      <td style="padding:36px 32px;">
                        <p style="margin:0 0 24px;color:#374151;font-size:15px;line-height:1.6;">
                          Here is your 6-digit login code. Enter it in the portfolio admin panel to access your dashboard.
                        </p>

                        <!-- OTP Code Box -->
                        <div style="background:#f3f4f6;border:2px solid #e5e7eb;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
                          <p style="margin:0 0 8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Your Login Code</p>
                          <p style="margin:0;font-size:42px;font-weight:800;letter-spacing:10px;color:#4f46e5;font-family:'Courier New',monospace;">${code}</p>
                        </div>

                        <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
                          <p style="margin:0;color:#92400e;font-size:13px;">
                            ⏱️ This code expires in <strong>10 minutes</strong> and can only be used once.
                          </p>
                        </div>

                        <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;">
                          If you did not request this code, please ignore this email. Your account remains secure.
                        </p>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="padding:20px 32px;border-top:1px solid #f3f4f6;text-align:center;">
                        <p style="margin:0;color:#d1d5db;font-size:12px;">Portfolio Admin System • Sent to ${normalizedEmail}</p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Code sent to your email' });
  } catch (err) {
    console.error('[send-otp] Unexpected error:', err);
    return NextResponse.json({ error: 'Failed to send code. Check server configuration.' }, { status: 500 });
  }
}
