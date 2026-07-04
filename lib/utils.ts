import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind class merge helper.
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatBytes(bytes: number | string, decimals = 2): string {
  const parsed = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (isNaN(parsed) || parsed === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(parsed) / Math.log(k));

  return parseFloat((parsed / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Triggers Next.js ISR revalidation for given paths.
 * Automatically attaches the server-side secret token.
 * Safe to call from client components — the token is a NEXT_PUBLIC_ var
 * because it only authorises cache purging, not any sensitive data.
 */
export async function revalidatePortfolio(paths: string[]): Promise<void> {
  try {
    const token = process.env.NEXT_PUBLIC_REVALIDATE_SECRET_TOKEN;
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ paths }),
    });
  } catch (err) {
    console.error('Revalidation request failed:', err);
  }
}

