// seed.js script to populate Supabase tables with realistic portfolio data
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSeed() {
  console.log('Seeding portfolio database...');

  try {
    // 1. Clear existing data safely
    console.log('Clearing old tables...');
    await supabase.from('hero').delete().neq('id', 'xxxx');
    await supabase.from('about').delete().neq('id', 'xxxx');
    await supabase.from('skills').delete().neq('id', 'xxxx');
    await supabase.from('experience').delete().neq('id', 'xxxx');
    await supabase.from('projects').delete().neq('id', 'xxxx');
    await supabase.from('certificates').delete().neq('id', 'xxxx');
    await supabase.from('resume').delete().neq('id', 'xxxx');
    await supabase.from('seo_settings').delete().neq('id', 'xxxx');
    await supabase.from('settings').delete().neq('id', 'xxxx');

    // 2. Insert Hero Singleton
    console.log('Seeding Hero...');
    await supabase.from('hero').insert([
      {
        id: true,
        name: 'Aaryan Sharma',
        role: 'Lead Full Stack Architect',
        tagline: 'Architecting high-performance distributed systems, Web3 applications, and enterprise SaaS solutions.',
        photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80',
        available: true,
        availability_label: 'Available for Core Contracts',
        github_url: 'https://github.com',
        linkedin_url: 'https://linkedin.com',
        twitter_url: 'https://twitter.com',
        email: 'admin@example.com',
        leetcode_url: 'https://leetcode.com',
        portfolio_url: 'https://example.com',
        stat_1_label: 'Years Experience',
        stat_1_value: '8+',
        stat_2_label: 'Github Commits',
        stat_2_value: '12K+',
        stat_3_label: 'Projects Completed',
        stat_3_value: '28+',
        stat_4_label: 'SaaS Products Built',
        stat_4_value: '10+',
      },
    ]);

    // 3. Insert About Singleton
    console.log('Seeding About...');
    await supabase.from('about').insert([
      {
        id: true,
        bio: `
          <p>I am a seasoned software engineer with over 8 years of experience designing robust architectures, scaling backend services, and polishing user experiences to the highest standard.</p>
          <p>My core strengths lie in the <strong>React / Next.js</strong> ecosystem, building highly optimized serverless pipelines, structuring <strong>TypeScript</strong> codebases, and scaling containerized infrastructures with <strong>Docker &amp; Kubernetes</strong>.</p>
          <p>I maintain a strong focus on web performance metrics, Core Web Vitals, semantic accessibility guidelines, and test-driven development methodologies.</p>
        `,
        education: 'M.S. in Computer Science, Stanford University',
        location: 'San Francisco, CA',
        current_position: 'Lead Architect at Macro Masala',
        years_experience: '8+ Years',
        career_interests: 'High-Performance Web, Distributed Cloud Architectures, UX Micro-interactions',
      },
    ]);

    // 4. Insert Skills (16 items across 4 categories)
    console.log('Seeding Skills...');
    const skills = [
      // Frontend
      { name: 'React', category: 'Frontend', years: 6.5, proficiency: 95, display_order: 1 },
      { name: 'Next.js', category: 'Frontend', years: 5, proficiency: 92, display_order: 2 },
      { name: 'TypeScript', category: 'Frontend', years: 6, proficiency: 90, display_order: 3 },
      { name: 'Tailwind CSS', category: 'Frontend', years: 5.5, proficiency: 95, display_order: 4 },
      // Backend
      { name: 'Node.js', category: 'Backend', years: 7, proficiency: 88, display_order: 5 },
      { name: 'Go (Golang)', category: 'Backend', years: 3.5, proficiency: 82, display_order: 6 },
      { name: 'PostgreSQL', category: 'Backend', years: 6, proficiency: 85, display_order: 7 },
      { name: 'GraphQL', category: 'Backend', years: 4, proficiency: 80, display_order: 8 },
      // DevOps
      { name: 'Docker', category: 'DevOps', years: 5, proficiency: 85, display_order: 9 },
      { name: 'Kubernetes', category: 'DevOps', years: 3.5, proficiency: 78, display_order: 10 },
      { name: 'AWS Cloud', category: 'DevOps', years: 4.5, proficiency: 80, display_order: 11 },
      { name: 'Terraform', category: 'DevOps', years: 3, proficiency: 75, display_order: 12 },
      // Tools & Testing
      { name: 'Git & Github', category: 'Tools', years: 8, proficiency: 95, display_order: 13 },
      { name: 'Jest / Vitest', category: 'Tools', years: 5, proficiency: 85, display_order: 14 },
      { name: 'Redis Cache', category: 'Tools', years: 4, proficiency: 80, display_order: 15 },
      { name: 'Figma Design', category: 'Tools', years: 3, proficiency: 70, display_order: 16 },
    ];
    await supabase.from('skills').insert(skills);

    // 5. Insert Experience (3 records)
    console.log('Seeding Experience...');
    await supabase.from('experience').insert([
      {
        company_name: 'Macro Masala',
        company_logo_url: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=200&auto=format&fit=crop&q=80',
        role: 'Lead Solutions Architect',
        employment_type: 'Full-time',
        start_month: 'Jan',
        start_year: '2023',
        is_current: true,
        description: '<p>Directing technical architecture for multi-tenant SaaS products and managing key dev squads.</p>',
        achievements: [
          'Decreased main application page-load metrics (FCP/LCP) by 38% globally',
          'Spearheaded migration of legacy services to Kubernetes, saving 22% in hosting costs',
          'Established automated Cypress E2E pipelines improving test coverage from 20% to 75%',
        ],
        tech_stack: ['Next.js', 'Go', 'PostgreSQL', 'Kubernetes'],
        display_order: 1,
      },
      {
        company_name: 'Acme Software Corp',
        company_logo_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80',
        role: 'Senior Software Engineer',
        employment_type: 'Full-time',
        start_month: 'Mar',
        start_year: '2020',
        end_month: 'Dec',
        end_year: '2022',
        is_current: false,
        description: '<p>Built real-time analytics data pipelines and optimized responsive frontends for cloud admins.</p>',
        achievements: [
          'Architected an event-driven dashboard handling 50K concurrent WebRTC connections',
          'Designed modular design system components shared across 5 products',
        ],
        tech_stack: ['React', 'TypeScript', 'Node.js', 'AWS', 'Redis'],
        display_order: 2,
      },
      {
        company_name: 'StartUp Labs',
        company_logo_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=200&auto=format&fit=crop&q=80',
        role: 'Full Stack Developer',
        employment_type: 'Full-time',
        start_month: 'Aug',
        start_year: '2017',
        end_month: 'Feb',
        end_year: '2020',
        is_current: false,
        description: '<p>Iterated product features for early-stage B2C and payment processing apps.</p>',
        achievements: [
          'Bootstrap engineered the initial React Native app yielding 40K app store downloads',
          'Integrated secure Stripe payment gateways supporting multi-currency subscription models',
        ],
        tech_stack: ['React Native', 'Node.js', 'MongoDB', 'Stripe'],
        display_order: 3,
      },
    ]);

    // 6. Insert Projects (6 records: 2 featured, 4 regular)
    console.log('Seeding Projects...');
    await supabase.from('projects').insert([
      {
        title: 'SaaS Multi-Tenant Analytics Panel',
        slug: 'saas-multitenant-analytics',
        short_description: 'An enterprise real-time metrics dashboard featuring custom charting, data grids, and team RBAC.',
        description: '<p>A complete analytical suite built to monitor high-frequency telemetry events, track business conversion metrics, and manage user subscription flows.</p>',
        problem_statement: '<p>Legacy software suffered from long query runtimes and lacked cohesive, real-time visualization systems, locking users into static daily email alerts.</p>',
        solution: '<p>Deployed a Next.js Server Components architecture paired with a Go-based WebSocket pipeline and Redis cache blocks, resolving data synchronization delays.</p>',
        architecture: '<p>Microservice structures orchestrated via Docker Compose, fetching cache pools from Redis, and piping query indexes to a relational PostgreSQL database.</p>',
        key_features: '<p>Highly interactive charting layouts, instant CSV database exports, RBAC permission filters, and multi-tenant billing integrations.</p>',
        challenges: '<p>Handling websocket re-connections on unstable networks. Resolved by implementing custom debounce queues and exponential back-off hooks.</p>',
        tech_stack: ['Next.js', 'Go', 'Redis', 'PostgreSQL', 'TailwindCSS'],
        demo_url: 'https://example.com',
        github_url: 'https://github.com',
        thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
        gallery_urls: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&auto=format&fit=crop&q=80',
        ],
        category: 'Full Stack',
        status: 'Completed',
        is_featured: true,
        display_order: 1,
        project_date: '2024',
      },
      {
        title: 'Draggable Portfolio CMS Panel',
        slug: 'draggable-portfolio-cms',
        short_description: 'A premium administrative content management panel featuring real-time reordering and inline OTP Auth.',
        description: '<p>Designed to help engineers manage their public records instantly without launching terminal pipelines or writing markdown documents manually.</p>',
        problem_statement: "<p>Developers shouldn't need to execute local git commits and deploy wait queues for minor edits in their bio or project portfolios.</p>",
        solution: '<p>Wrote a floating slider drawer utilizing Supabase Auth OTP, react-hook-form schema validations, and @dnd-kit reorder contexts.</p>',
        architecture: '<p>Next.js Client Components syncing sessions with Supabase client-side cookies, invoking revalidation API hooks on path saves.</p>',
        key_features: '<p>Split-digit OTP forms, drag-and-drop sortable lists, file upload progress meters, and dynamic CSS theme builders.</p>',
        challenges: '<p>Maintaining layout state synchronization on re-renders. Solved by binding react-query queries and local state hooks.</p>',
        tech_stack: ['Next.js', 'Supabase', 'Framer Motion', 'TypeScript'],
        demo_url: 'https://example.com',
        github_url: 'https://github.com',
        thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        gallery_urls: [
          'https://images.unsplash.com/photo-1541462608141-2ffb68df685e?w=600&auto=format&fit=crop&q=80',
        ],
        category: 'Frontend',
        status: 'Completed',
        is_featured: true,
        display_order: 2,
        project_date: '2024',
      },
      {
        title: 'WebRTC Collaborative Whiteboard',
        slug: 'webrtc-collab-whiteboard',
        short_description: 'Real-time interactive whiteboards featuring digital brushes, room invites, and peer-to-peer sync.',
        description: '<p>A peer-to-peer visual canvas that lets designers and teams sketch prototypes together with sub-100ms latency.</p>',
        tech_stack: ['React', 'WebRTC', 'TypeScript', 'Node.js'],
        demo_url: 'https://example.com',
        github_url: 'https://github.com',
        thumbnail_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
        category: 'Frontend',
        status: 'Completed',
        is_featured: false,
        display_order: 3,
        project_date: '2023',
      },
      {
        title: 'Distributed Cron Scheduler Daemon',
        slug: 'dist-cron-scheduler',
        short_description: 'A fault-tolerant scheduled task runner built in Go capable of running millions of jobs with high availability.',
        description: '<p>Handles high-throughput chron events with automatic failover triggers and job partition balancing.</p>',
        tech_stack: ['Go', 'gRPC', 'Redis', 'Docker'],
        github_url: 'https://github.com',
        thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        category: 'Backend',
        status: 'Completed',
        is_featured: false,
        display_order: 4,
        project_date: '2023',
      },
      {
        title: 'Token Swap Exchange Aggregator',
        slug: 'token-swap-exchange',
        short_description: 'Ethereum-based ERC20 token swap interface pulling API rates across decentralized liquidity networks.',
        description: '<p>Integrates smart-routing algorithms to exchange decentralized assets with minimal slippage metrics.</p>',
        tech_stack: ['React', 'Solidity', 'Ethers.js', 'GraphQL'],
        demo_url: 'https://example.com',
        thumbnail_url: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&auto=format&fit=crop&q=80',
        category: 'Full Stack',
        status: 'Completed',
        is_featured: false,
        display_order: 5,
        project_date: '2022',
      },
      {
        title: 'Nginx Configuration Telemetry Agent',
        slug: 'nginx-telemetry-agent',
        short_description: 'An open-source telemetry daemon that parses config files and pushes log metrics to dashboard databases.',
        description: '<p>Pipes access logs and virtual host configurations directly into central monitoring servers.</p>',
        tech_stack: ['Go', 'InfluxDB', 'Grafana', 'Linux'],
        github_url: 'https://github.com',
        thumbnail_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
        category: 'Backend',
        status: 'Completed',
        is_featured: false,
        display_order: 6,
        project_date: '2022',
      },
    ]);

    // 7. Insert Certificates (4 records)
    console.log('Seeding Certificates...');
    await supabase.from('certificates').insert([
      {
        title: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        issue_date: 'Oct 2023',
        credential_url: 'https://credly.com',
        preview_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
        display_order: 1,
      },
      {
        title: 'Certified Kubernetes Administrator (CKA)',
        issuer: 'The Linux Foundation',
        issue_date: 'Aug 2023',
        credential_url: 'https://credly.com',
        preview_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
        display_order: 2,
      },
      {
        title: 'HashiCorp Certified: Terraform Associate',
        issuer: 'HashiCorp',
        issue_date: 'May 2023',
        credential_url: 'https://credly.com',
        preview_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
        display_order: 3,
      },
      {
        title: 'Meta Front-End Developer Professional Certificate',
        issuer: 'Coursera / Meta',
        issue_date: 'Jan 2023',
        credential_url: 'https://coursera.org',
        preview_image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
        display_order: 4,
      },
    ]);

    // 8. Insert SEO Settings Singleton
    console.log('Seeding SEO settings...');
    await supabase.from('seo_settings').insert([
      {
        id: true,
        portfolio_title: 'Aaryan Sharma | Lead Full Stack Architect',
        meta_description: 'Professional portfolio showcasing distributed systems designs, full-stack applications, and clean codes.',
        keywords: ['full stack architect', 'next.js developer', 'go systems developer', 'software engineer portfolio'],
        og_title: 'Aaryan Sharma | Lead Full Stack Architect',
        og_description: 'Case studies, resume CV downloads, and technical skills portfolio.',
        robots_txt: 'User-agent: *\nAllow: /\nDisallow: /admin',
      },
    ]);

    // 9. Insert Global Settings Singleton
    console.log('Seeding Settings...');
    await supabase.from('settings').insert([
      {
        id: true,
        accent_color: '#4F46E5',
        animation_intensity: 'normal',
        portfolio_visible: true,
        available_for_work: true,
        show_availability_badge: true,
        maintenance_mode: false,
        last_updated_at: new Date().toISOString(),
      },
    ]);

    console.log('SUCCESS: Seeding completed successfully!');
  } catch (err) {
    console.error('ERROR during seeding database:', err);
    process.exit(1);
  }
}

runSeed();
