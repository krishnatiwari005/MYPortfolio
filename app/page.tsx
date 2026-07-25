import {
  getHero,
  getAbout,
  getSkills,
  getExperience,
  getProjects,
  getCertificates,
  getHackathons,
  getResume,
  getSettings,
} from '@/lib/supabase/queries';
import PortfolioClient from '@/components/portfolio/PortfolioClient';

// Enable ISR revalidation config (default cache)
export const revalidate = 3600; // 1 hour revalidation cache

export default async function HomePage() {
  // Query all database values in parallel
  const [hero, about, skills, experience, projects, certificates, hackathons, resume, settings] = await Promise.all([
    getHero(),
    getAbout(),
    getSkills(),
    getExperience(),
    getProjects(),
    getCertificates(),
    getHackathons(),
    getResume(),
    getSettings(),
  ]);

  return (
    <PortfolioClient
      hero={hero}
      about={about}
      skills={skills}
      experience={experience}
      projects={projects}
      certificates={certificates}
      hackathons={hackathons}
      resume={resume}
      settings={settings}
    />
  );
}
