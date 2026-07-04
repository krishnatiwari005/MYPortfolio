import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // --- Security: Require a secret revalidation token ---
    const authHeader = req.headers.get('authorization');
    const expectedToken = process.env.REVALIDATE_SECRET_TOKEN;

    if (!expectedToken) {
      // If env var is not set, block all revalidations in production
      console.error('REVALIDATE_SECRET_TOKEN is not configured');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // ---------------------------------------------------

    const { paths } = await req.json();

    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json({ error: 'Missing paths array parameter' }, { status: 400 });
    }

    // Trigger revalidation for each path
    for (const path of paths) {
      if (typeof path === 'string') {
        revalidatePath(path);
      }
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: any) {
    console.error('Revalidation failed:', err);
    return NextResponse.json({ error: err.message || 'Server error during revalidation' }, { status: 500 });
  }
}
