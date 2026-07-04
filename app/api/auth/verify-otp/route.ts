import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ─── Supabase Admin Client (service role, server-only) ───────────────────────
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ─── POST /api/auth/verify-otp ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();

    // ── 1. Find a valid, unused OTP code for this email ──
    const { data: otpRecord, error: fetchError } = await supabaseAdmin
      .from('admin_otp_codes')
      .select('*')
      .eq('email', normalizedEmail)
      .eq('code', normalizedCode)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString()) // not expired
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired code. Please request a new one.' },
        { status: 401 }
      );
    }

    // ── 2. Mark code as used immediately (single-use) ──
    await supabaseAdmin
      .from('admin_otp_codes')
      .update({ used: true })
      .eq('id', otpRecord.id);

    // ── 3. Generate a sign-in link via Supabase Admin (creates a valid session token) ──
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: normalizedEmail,
    });

    if (linkError || !linkData?.properties?.hashed_token) {
      console.error('[verify-otp] generateLink error:', linkError);
      return NextResponse.json(
        { error: 'Session creation failed. Try again.' },
        { status: 500 }
      );
    }

    // ── 4. Return the token hash — client will use it to establish session ──
    return NextResponse.json({
      success: true,
      tokenHash: linkData.properties.hashed_token,
    });
  } catch (err) {
    console.error('[verify-otp] Unexpected error:', err);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }
}
