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

// ─── Rate limiting: max 3 requests per 10 minutes per IP ──────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return true;
  }

  if (entry.count >= 3) return false;

  entry.count++;
  return true;
}

// ─── POST /api/contact ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // ── 1. Rate limiting ──
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a few minutes before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, company, subject, message, website } = body;

    // ── 2. Honeypot Spam Protection ──
    if (website) {
      // If honeypot is filled, it's a bot. Silently accept to fool the bot.
      return NextResponse.json({ success: true, message: 'Message sent successfully!' });
    }

    // ── 3. Server-side Validation ──
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedCompany = company?.trim() || '';
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    // ── 4. Store Message in Supabase ──
    const { error: dbError } = await supabaseAdmin
      .from('contact_messages')
      .insert({
        name: trimmedName,
        email: trimmedEmail,
        company: trimmedCompany,
        subject: trimmedSubject,
        message: trimmedMessage
      });

    if (dbError) {
      console.error('[contact] DB insert error:', dbError);
      return NextResponse.json({ error: 'Failed to save message. Try again later.' }, { status: 500 });
    }

    // ── 5. Send Notification via Email ──
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.ADMIN_EMAIL || process.env.GMAIL_USER;
    
    if (receiverEmail && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = createTransporter();

      const mailOptions = {
        from: `"Portfolio Contact Form" <${process.env.GMAIL_USER}>`,
        to: receiverEmail,
        replyTo: trimmedEmail,
        subject: `New Portfolio Contact: ${trimmedSubject}`,
        text: `New contact message from your portfolio\n\nName: ${trimmedName}\nEmail: ${trimmedEmail}\nCompany: ${trimmedCompany || 'N/A'}\nSubject: ${trimmedSubject}\n\nMessage:\n${trimmedMessage}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
            <h2 style="color: #00e5ff; border-bottom: 2px solid #00e5ff; padding-bottom: 10px;">New Portfolio Contact</h2>
            <p><strong>Name:</strong> ${trimmedName}</p>
            <p><strong>Email:</strong> ${trimmedEmail}</p>
            <p><strong>Company:</strong> ${trimmedCompany || 'N/A'}</p>
            <p><strong>Subject:</strong> ${trimmedSubject}</p>
            <br/>
            <h3>Message:</h3>
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #00e5ff; white-space: pre-wrap;">${trimmedMessage}</div>
            <br/>
            <p style="font-size: 12px; color: #999;">This message was sent from your portfolio contact form.</p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('[contact] Email sending error:', emailError);
        // We don't fail the request if email fails but DB succeeded
        // Just log it.
      }
    } else {
      console.warn('[contact] Email configuration missing, message saved to DB only.');
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return NextResponse.json({ error: 'Failed to process request. Check server configuration.' }, { status: 500 });
  }
}
