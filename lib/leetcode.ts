export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  totalSubmissions: number;
  ranking: number;
  reputation: number;
  attendedContestsCount: number;
  contestRating: number;
  contestGlobalRanking: number;
  contestTopPercentage: number;
  badges: string[];
  profileUrl: string;
  fetchedAt: string;
}

// In-memory cache to prevent spamming LeetCode API on every chat message while staying fresh (5 min TTL)
let cache: { data: LeetCodeStats; timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function extractLeetCodeUsername(urlOrUsername?: string | null): string {
  if (!urlOrUsername) return 'Krishna_Tiwari005';
  const match = urlOrUsername.match(/(?:leetcode\.com(?:\/u)?)\/([^\/?#]+)/i);
  if (match && match[1]) return match[1];
  const clean = urlOrUsername.replace(/https?:\/\/|www\.|\//g, '').trim();
  return clean || 'Krishna_Tiwari005';
}

export async function getLiveLeetCodeStats(urlOrUsername?: string | null): Promise<LeetCodeStats | null> {
  const username = extractLeetCodeUsername(urlOrUsername);
  const now = Date.now();

  if (cache && cache.data.username.toLowerCase() === username.toLowerCase() && now - cache.timestamp < CACHE_TTL_MS) {
    return cache.data;
  }

  const query = `
    query getUserLeetCodeStats($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          reputation
        }
        badges {
          displayName
        }
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        topPercentage
      }
    }
  `;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`[LeetCode API] Non-OK status: ${res.status}`);
      return cache?.data ?? null;
    }

    const json = await res.json();
    const matchedUser = json?.data?.matchedUser;
    if (!matchedUser) {
      console.warn(`[LeetCode API] No matchedUser found for ${username}`);
      return cache?.data ?? null;
    }

    const subList = matchedUser.submitStats?.acSubmissionNum || [];
    const all = subList.find((s: { difficulty: string }) => s.difficulty === 'All') || { count: 0, submissions: 0 };
    const easy = subList.find((s: { difficulty: string }) => s.difficulty === 'Easy') || { count: 0 };
    const medium = subList.find((s: { difficulty: string }) => s.difficulty === 'Medium') || { count: 0 };
    const hard = subList.find((s: { difficulty: string }) => s.difficulty === 'Hard') || { count: 0 };

    const contest = json?.data?.userContestRanking || {};

    const badges = Array.isArray(matchedUser.badges)
      ? matchedUser.badges.map((b: { displayName: string }) => b.displayName).filter(Boolean)
      : [];

    const stats: LeetCodeStats = {
      username: matchedUser.username || username,
      totalSolved: all.count || 0,
      easySolved: easy.count || 0,
      mediumSolved: medium.count || 0,
      hardSolved: hard.count || 0,
      totalSubmissions: all.submissions || 0,
      ranking: matchedUser.profile?.ranking || 0,
      reputation: matchedUser.profile?.reputation || 0,
      attendedContestsCount: contest.attendedContestsCount || 0,
      contestRating: Math.round(contest.rating || 0),
      contestGlobalRanking: contest.globalRanking || 0,
      contestTopPercentage: contest.topPercentage || 0,
      badges,
      profileUrl: `https://leetcode.com/u/${matchedUser.username || username}/`,
      fetchedAt: new Date().toISOString(),
    };

    cache = { data: stats, timestamp: now };
    return stats;
  } catch (error) {
    console.error('[LeetCode API Error]:', error);
    return cache?.data ?? null;
  }
}
