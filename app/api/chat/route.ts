import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import {
  getHero,
  getAbout,
  getSkills,
  getExperience,
  getProjects,
  getCertificates,
  getHackathons,
  getResume,
} from '@/lib/supabase/queries';
import { getLiveLeetCodeStats } from '@/lib/leetcode';
import { NextResponse } from 'next/server';

const groq = createOpenAI({
  apiKey: process.env.GROK_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1',
});

// Helper to strip HTML tags for clean AI prompt context
function stripHtml(text?: string | null): string {
  if (!text) return '';
  return text.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROK_API_KEY) {
      console.error('GROK_API_KEY is not set in .env.local');
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Fetch all portfolio data and live LeetCode stats in parallel
    const [hero, about, skills, experience, projects, certificates, hackathons, resume] =
      await Promise.all([
        getHero(),
        getAbout(),
        getSkills(),
        getExperience(),
        getProjects(),
        getCertificates(),
        getHackathons(),
        getResume(),
      ]);

    const leetcodeStats = await getLiveLeetCodeStats(hero?.leetcode_url || 'Krishna_Tiwari005');

    const statsSummary = [
      hero?.stat_1_label && hero?.stat_1_value ? `${hero.stat_1_label}: ${hero.stat_1_value}` : null,
      hero?.stat_2_label && hero?.stat_2_value ? `${hero.stat_2_label}: ${hero.stat_2_value}` : null,
      hero?.stat_3_label && hero?.stat_3_value ? `${hero.stat_3_label}: ${hero.stat_3_value}` : null,
      hero?.stat_4_label && hero?.stat_4_value ? `${hero.stat_4_label}: ${hero.stat_4_value}` : null,
    ]
      .filter(Boolean)
      .join(' | ');

    const certificatesList = certificates.length > 0
      ? certificates
          .map(
            (c) =>
              `• ${c.title} by ${c.issuer} (${c.issue_date || 'Certified'})${
                c.credential_url ? ` [Verification: ${c.credential_url}]` : ''
              }`
          )
          .join('\n')
      : 'None listed';

    const hackathonsList = hackathons.length > 0
      ? hackathons
          .map(
            (h) =>
              `• ${h.title} (${h.organization}, ${h.date})${
                h.project_name ? ` - Project: ${h.project_name}` : ''
              }${h.description ? ` (${stripHtml(h.description)})` : ''}`
          )
          .join('\n')
      : 'None listed';

    const skillsGrouped = skills.reduce<Record<string, string[]>>((acc, skill) => {
      const cat = skill.category || 'General';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(`${skill.name} (${skill.proficiency || 85}% proficiency)`);
      return acc;
    }, {});

    const skillsText = Object.entries(skillsGrouped)
      .map(([cat, items]) => `${cat}: ${items.join(', ')}`)
      .join('\n');

    const experienceList = experience.length > 0
      ? experience
          .map(
            (e) =>
              `• ${e.role} at ${e.company_name} (${e.start_month} ${e.start_year} – ${
                e.is_current ? 'Present' : `${e.end_month || ''} ${e.end_year || ''}`
              })\n  - Details: ${stripHtml(e.description)}\n  - Achievements: ${
                e.achievements?.join('; ') || 'N/A'
              }\n  - Tech: ${e.tech_stack?.join(', ') || 'N/A'}`
          )
          .join('\n\n')
      : 'None listed';

    const projectsList = projects.length > 0
      ? projects
          .map(
            (p) =>
              `• ${p.title} (${p.category || 'Project'}, ${p.status || 'Completed'})\n  - Summary: ${p.short_description || stripHtml(p.description)}\n  - Tech Stack: ${
                p.tech_stack?.join(', ') || 'N/A'
              }${p.github_url ? `\n  - Code: ${p.github_url}` : ''}${
                p.demo_url ? `\n  - Live Demo: ${p.demo_url}` : ''
              }`
          )
          .join('\n\n')
      : 'None listed';

    const leetcodeDetails = leetcodeStats
      ? `- Status: LIVE REAL-TIME DATA FETCHED DIRECTLY FROM LEETCODE API (Do NOT cite old static placeholder values!)
- LeetCode Username: ${leetcodeStats.username}
- Total Solved: ${leetcodeStats.totalSolved} problems (Easy: ${leetcodeStats.easySolved} | Medium: ${leetcodeStats.mediumSolved} | Hard: ${leetcodeStats.hardSolved})
- Total Submissions: ${leetcodeStats.totalSubmissions.toLocaleString()}
- Global Profile Ranking: #${leetcodeStats.ranking.toLocaleString()}
- Contest Rating: ${leetcodeStats.contestRating} (${leetcodeStats.attendedContestsCount} contests attended, Global Rank #${leetcodeStats.contestGlobalRanking.toLocaleString()}, Top ${leetcodeStats.contestTopPercentage}%)
- Earned Badges: ${leetcodeStats.badges.join(', ') || '200 Days Badge 2026, 100 Days Badge 2026, 50 Days Badge 2026'}
- Direct Profile Link: [LeetCode Profile](${leetcodeStats.profileUrl})`
      : `- LeetCode Profile: [LeetCode Profile](${hero?.leetcode_url || 'https://leetcode.com/u/Krishna_Tiwari005/'})
- Total Solved: 378+ problems solved (Easy, Medium, Hard)
- Highlights: ${statsSummary || 'Consistent Problem Solver | Contests | 8+ CGPA'}`;

    const systemMessage = `You are KrisNova, a warm, intelligent, and highly capable AI assistant on ${
      hero?.name || 'the developer'
    }'s portfolio website. Your role is to help recruiters, hiring managers, and visitors learn everything about ${
      hero?.name?.split(' ')[0] || 'the developer'
    }'s background, skills, projects, certifications, LeetCode problem-solving experience, and resume. Always introduce yourself as KrisNova when asked who you are.

TONE & STYLE GUIDELINES:
- Be warm, professional, articulate, and conversational.
- Keep answers clear, digestible, and well-spaced. Avoid overwhelming walls of text.
- **CRITICAL FORMATTING RULE (NO RAW TABLES)**: The chat interface is a compact messenger window. NEVER output raw multi-column markdown tables (like | Col 1 | Col 2 | Col 3 |). They look cluttered and unreadable in mobile chat windows.
- **ALWAYS USE CLEAN BULLET CARDS**: Format lists (certifications, experience, projects, stats) as clean, spaced bullet cards:
  Example for Certifications:
  • **AI-Agent Using AGNO** — *CampusX* (September 2026)
    [Verify Credential](https://...)
  Example for LeetCode / DSA:
  • **Total Problems Solved**: ${leetcodeStats?.totalSolved ?? 378} (Easy: ${leetcodeStats?.easySolved ?? 285} • Medium: ${leetcodeStats?.mediumSolved ?? 83} • Hard: ${leetcodeStats?.hardSolved ?? 10})
  • **Contest Rating**: ${leetcodeStats?.contestRating ?? 1215} (${leetcodeStats?.attendedContestsCount ?? 11} Contests)
  • **Global Profile Ranking**: #${(leetcodeStats?.ranking ?? 361973).toLocaleString()}
  • **Badges**: ${leetcodeStats?.badges.join(', ') || '200 Days Badge, 100 Days Badge, 50 Days Badge'}
  • [View LeetCode Profile](${leetcodeStats?.profileUrl || hero?.leetcode_url || 'https://leetcode.com/u/Krishna_Tiwari005/'})
- **IMPORTANT – LINK FORMATTING**: Always format URLs as markdown hyperlinks using [label](url) syntax (e.g. [View Certificate](https://...)), NEVER as raw URLs.
- If asked about LeetCode, DSA, or problem-solving: ALWAYS provide the EXACT LIVE numbers listed above. Highlight the problem difficulty breakdown, consistency badges, and contest participation.
- If asked about Certifications & Hackathons: give exact certification titles, issuing bodies, dates, and format credential links as [Verify Credential](url).
- If asked about Resume / CV / Education / Work History: summarize relevant qualifications and mention they can download the full resume formatted as [Download Resume](${resume?.file_url || '#'}).
- NEVER give out the email address unless the visitor explicitly asks "how can I contact", "what is the email", or similar contact questions.
- If asked something completely outside the portfolio and developer background, politely clarify that you specialize in ${
      hero?.name?.split(' ')[0] || 'the developer'
    }'s portfolio, technical work, and resume.

=====================================================
DEVELOPER & PORTFOLIO DATA CONTEXT:
=====================================================

1. PROFILE & BIO:
- Full Name: ${hero?.name || 'Developer'}
- Professional Title: ${hero?.role || 'Full Stack Engineer'}
- Tagline: ${hero?.tagline || ''}
- Availability: ${hero?.available ? `Available (${hero?.availability_label || 'Open for work'})` : 'Currently unavailable'}
- Location: ${about?.location || 'Remote / Worldwide'}
- Education: ${about?.education || 'Computer Science'}
- Current Position: ${about?.current_position || hero?.role || 'Software Engineer'}
- Experience Level: ${about?.years_experience || 'Experienced'}
- Career Interests: ${about?.career_interests || 'AI/ML, Web Systems, Cloud'}
- Bio: ${stripHtml(about?.bio)}

2. LEETCODE & PROBLEM SOLVING STATS (LIVE DATA):
${leetcodeDetails}
- Problem Solving Strengths: Data Structures & Algorithms, Dynamic Programming, Graphs, Optimization, System Design, Competitive Programming.

3. CERTIFICATIONS & CREDENTIALS:
${certificatesList}

4. HACKATHONS & COMPETITIVE ACHIEVEMENTS:
${hackathonsList}

5. RESUME & CV FILE DETAILS:
- Resume Download Link: ${resume?.file_url || 'Available via the Resume section on this portfolio'}
- File Name: ${resume?.original_filename || 'Resume.pdf'}
- File Size: ${resume?.file_size || 'PDF Document'}
- Last Uploaded/Updated: ${resume?.uploaded_at || 'Recent'}

6. TECHNICAL SKILLS:
${skillsText}

7. WORK EXPERIENCE & CAREER HISTORY:
${experienceList}

8. FEATURED PROJECTS:
${projectsList}

9. SOCIAL & PROFILE LINKS:
- GitHub: ${hero?.github_url || 'N/A'}
- LinkedIn: ${hero?.linkedin_url || 'N/A'}
- LeetCode: ${hero?.leetcode_url || 'N/A'}
- Twitter / X: ${hero?.twitter_url || 'N/A'}
- Contact Email: ${hero?.email || 'available on the Contact section'}

Answer user inquiries accurately using this authentic context!`;

    const result = streamText({
      model: groq('openai/gpt-oss-120b'),
      system: systemMessage,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    console.error('[Chat API Error]:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
