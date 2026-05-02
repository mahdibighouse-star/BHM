export type ProjectStatus = 'Active' | 'To Close' | 'Waiting Client' | 'Blocked' | 'Ghost' | 'Delivered';

export interface Note {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
}

export interface Doc {
  id: string;
  title: string;
  url: string;
  type: string;
}

export interface Project {
  id: string;
  num: string;
  name: string;
  status: ProjectStatus;
  statusDetail: string;
  devIds: string[];
  omId?: string; 
  salesId?: string;
  agent: string;
  nextAction: string;
  reason?: string;
  recommendedSolution?: string;
  waGroup: string;
  invoiceLink?: string;
  websiteLink?: string;
  clientInfo: {
    name: string;
    objective: string;
  };
  notes: Note[];
  docs: Doc[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  waLink: string;
  category?: string;
}

export interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
  revisions: string;
  tools: string[];
  resources: string[];
  process: string[];
  image?: string;
  fullSop?: string;
}

export interface AIAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  status: 'Online' | 'Idle' | 'Training';
  capabilities: string[];
}

export const AI_AGENTS: Record<string, AIAgent> = {
  researcher: {
    id: 'researcher',
    name: 'ResearchGPT',
    role: 'Market & Data Analyst',
    avatar: '🔍',
    description: 'Specializes in analyzing market trends, competitive intelligence, and gathering reference materials for projects.',
    status: 'Online',
    capabilities: ['Web Search', 'Data Summarization', 'Competitor Analysis']
  },
  dev: {
    id: 'dev',
    name: 'AutoCoder',
    role: 'Senior Developer Agent',
    avatar: '💻',
    description: 'Writes, reviews, and refactors code. Can scaffold boilerplate and solve specific technical tickets.',
    status: 'Online',
    capabilities: ['Code Generation', 'Code Review', 'Bug Fixing', 'Architecture Planning']
  },
  qa: {
    id: 'qa',
    name: 'TestMaster',
    role: 'Quality Assurance Agent',
    avatar: '🛡️',
    description: 'Generates unit and integration tests, performs static analysis, and finds edge cases in system logic.',
    status: 'Online',
    capabilities: ['Test Generation', 'Vulnerability Scanning', 'E2E Testing']
  },
  devops: {
    id: 'devops',
    name: 'DeploySys',
    role: 'DevOps & CI/CD Agent',
    avatar: '⚙️',
    description: 'Automates infrastructure setup, CI/CD pipelines, and monitors system health.',
    status: 'Idle',
    capabilities: ['Pipeline Configuration', 'Cloud Provisioning', 'Log Analysis']
  },
  pm: {
    id: 'pm',
    name: 'Coordinator',
    role: 'Product Manager Agent',
    avatar: '📋',
    description: 'Translates high-level goals into actionable project cards, manages sprint backlogs, and estimates timelines.',
    status: 'Online',
    capabilities: ['Ticket Generation', 'Sprint Planning', 'Timeline Estimation', 'Task Orchestration']
  },
  clientops: {
    id: 'clientops',
    name: 'Communicator',
    role: 'Client Operations Agent',
    avatar: '💬',
    description: 'Drafts client updates, email communications, and parses client requirements from raw meeting transcripts.',
    status: 'Online',
    capabilities: ['Email Drafting', 'Meeting Summarization', 'Tone Adjustment', 'Client Management']
  },
  optimizer: {
    id: 'optimizer',
    name: 'The Optimizer',
    role: 'SEO/GEO Engine',
    avatar: '⚡',
    description: 'Reads GSC keywords via n8n. Analyzes Perplexity trends, runs Semrush audits. Generates strategies & campaigns. Scrapes top 5 competitors for reverse engineering. Writes SEO plan for the SEO Writer.',
    status: 'Online',
    capabilities: ['Schema Coding', 'Semantic Writing', 'Technical SEO', 'Competitor Reverse-Engineering']
  },
  seo_writer: {
    id: 'seo_writer',
    name: 'SEO Writer',
    role: 'Content Engine',
    avatar: '✍️',
    description: 'Connected to The Optimizer. Takes detailed SEO strategies and generates optimized, high-ranking content, semantic clusters, and converting copy.',
    status: 'Online',
    capabilities: ['SEO Copywriting', 'Long-form Content', 'Semantic Structuring']
  }
};

export const TEAM: Record<string, TeamMember> = {
  mahdi_om: {
    id: 'mahdi_om',
    name: 'Mahdi (Owner)',
    role: 'CTO & OM',
    avatar: 'MH',
    waLink: 'https://wa.me/something',
    category: 'Manager'
  },
  asmae: {
    id: 'asmae',
    name: 'Asmae',
    role: 'Developer',
    avatar: 'AS',
    waLink: 'https://wa.me/something',
    category: 'Developer'
  },
  badr: {
    id: 'badr',
    name: 'Badr',
    role: 'Developer',
    avatar: 'BD',
    waLink: 'https://wa.me/something',
    category: 'Developer'
  },
  mahdi_dev: {
    id: 'mahdi_dev',
    name: 'Mahdi (Dev)',
    role: 'Developer',
    avatar: 'MD',
    waLink: 'https://wa.me/something',
    category: 'Developer'
  },
  romy: {
    id: 'romy',
    name: 'Romy',
    role: 'Manager',
    avatar: 'RM',
    waLink: 'https://wa.me/something',
    category: 'Manager'
  },
  oumimma: {
    id: 'oumimma',
    name: 'Oumimma',
    role: 'SEO Freelancer',
    avatar: 'OM',
    waLink: 'https://wa.me/something',
    category: 'Operations'
  },
  hanane: {
    id: 'hanane',
    name: 'Hanane',
    role: 'Morocco Sales Manager',
    avatar: 'HN',
    waLink: 'https://wa.me/something',
    category: 'Sales'
  },
  joseph: {
    id: 'joseph',
    name: 'Joseph',
    role: 'Automations Manager',
    avatar: 'JS',
    waLink: 'https://wa.me/something',
    category: 'Manager'
  },
  karim: {
    id: 'karim',
    name: 'Karim',
    role: 'Sales & Dev',
    avatar: 'KR',
    waLink: 'https://wa.me/something',
    category: 'Coordinator'
  }
};

export const PROJECTS: Project[] = [
  {
    id: 'p_imspa',
    num: '07',
    name: 'IMSPA - SPA Launch',
    status: 'Active',
    statusDetail: 'PACK GLOBAL SPA – BRANDING, SITE PROFESSIONNEL, RÉSEAUX SOCIAUX',
    devIds: [],
    omId: 'mahdi_om',
    agent: 'Commander',
    nextAction: 'Initiate branding and layout proposals according to the invoice.',
    waGroup: 'IMSPA / BHM',
    invoiceLink: '/invoices/Facture_IMSPA.pdf',
    clientInfo: {
      name: 'IMSPA',
      objective: 'Créer une image de marque premium, un site performant et une présence digitale forte (15 Dec 2025).'
    },
    notes: [
      { id: 'n_imspa_1', authorId: 'mahdi_om', content: 'Invoiced for Branding, 5-8 page Premium WordPress site, and Social Media Setup (Offert).', timestamp: new Date().toISOString() }
    ],
    docs: []
  },
  {
    id: 'p_touchal',
    num: '08',
    name: 'Mademoiselle TOUCHAL - eCommerce Site',
    status: 'Active',
    statusDetail: 'Création site Internet complet & Visibilité',
    devIds: [],
    omId: 'mahdi_om',
    agent: 'Commander',
    nextAction: 'Schedule technical kick-off for payment integrations and QR code setup.',
    waGroup: 'TOUCHAL / BHM',
    invoiceLink: '/invoices/Facture_TOUCHAL.pdf',
    clientInfo: {
      name: 'Mademoiselle TOUCHAL',
      objective: 'Site 5-8 pages with payments, advanced features (bons cadeaux, chatbot, QR code) and social media management (24 Nov 2025).'
    },
    notes: [
      { id: 'n_touchal_1', authorId: 'mahdi_om', content: 'Invoiced for Web Development + Visibility (social management). Includes advanced integrations like PayPal, QR.', timestamp: new Date().toISOString() }
    ],
    docs: []
  },
  {
    id: 'p01',
    num: '01',
    name: 'Aylim',
    status: 'Active',
    statusDetail: 'Modernize design + speed. Client refused form, brief from call only.',
    devIds: ['asmae'],
    agent: 'Commander',
    nextAction: 'Continue prod',
    reason: 'Requested modernization without form.',
    recommendedSolution: 'Stick to the brief established via call, do not stray into new features.',
    waGroup: 'Aylim / BHM',
    clientInfo: {
      name: 'Aylim Contact',
      objective: 'Modernize existing design and optimize speed.'
    },
    notes: [
      { id: 'n1', authorId: 'mahdi_om', content: 'Make sure not to blow the scope.', timestamp: new Date().toISOString() }
    ],
    docs: [
      { id: 'd1', title: 'Call Brief', url: '#', type: 'doc' },
      { id: 'd2', title: 'Assets Drive', url: '#', type: 'folder' }
    ]
  },
  {
    id: 'p02',
    num: '02',
    name: 'Fantinolux',
    status: 'Active',
    statusDetail: 'URGENT: migrate Hostinger → Kinsta. Big client.',
    devIds: ['badr'],
    agent: 'Commander',
    nextAction: 'Migrate hosting NOW',
    reason: 'Hostinger is insufficient for their traffic/needs.',
    recommendedSolution: 'Perform migration during off-peak hours, verify DNS propagation.',
    waGroup: 'Fantinolux X BHM',
    clientInfo: {
      name: 'Fantinolux Team',
      objective: 'Finish remaining changes and migrate to scalable hosting.'
    },
    notes: [],
    docs: []
  },
  {
    id: 'p04',
    num: '04',
    name: 'Ghizlan centre américain',
    status: 'Active',
    statusDetail: 'Schedule dev + client meet for final mods.',
    devIds: ['asmae'],
    agent: 'Coordinator',
    nextAction: 'Schedule meet',
    reason: '',
    recommendedSolution: '',
    waGroup: 'Ghizlan CA X BHM',
    clientInfo: {
      name: 'Ghizlan',
      objective: 'Final touches on the website before launch.'
    },
    notes: [], docs: []
  },
  {
    id: 'p05',
    num: '05',
    name: 'Silti',
    status: 'Active',
    statusDetail: 'Never satisfied, paid little. Schedule framing call.',
    devIds: ['mahdi_dev'],
    agent: 'Commander',
    nextAction: 'Framing call',
    reason: 'Scope creep due to lacking clear boundaries.',
    recommendedSolution: 'Firm alignment call on what is included vs paid additions.',
    waGroup: 'Silti X BHM',
    clientInfo: {
      name: 'Silti Contact',
      objective: 'Wants next level site but paid for minimum.'
    },
    notes: [], docs: []
  },
  {
    id: 'p12',
    num: '12',
    name: 'Musk & Couture',
    status: 'Waiting Client',
    statusDetail: 'Closed by Hanane. Waiting last info.',
    devIds: [],
    salesId: 'hanane',
    agent: 'Onboarder',
    nextAction: 'Contact Hanane',
    waGroup: 'Musk & Couture X BHM',
    clientInfo: {
      name: 'Musk & Couture',
      objective: 'Launch e-commerce brand.'
    },
    notes: [], docs: []
  },
  {
    id: 'p03',
    num: '03',
    name: 'Emmanuel Lunardi',
    status: 'To Close',
    statusDetail: 'Call to migrate 2 sites + 4 domains. Push Google Workspace.',
    devIds: [],
    agent: 'Communicator',
    nextAction: 'Call + migrate 4 domains',
    waGroup: 'Emmanuel L X BHM',
    clientInfo: {
      name: 'Emmanuel Lunardi',
      objective: 'Migrate hosting and tidy up setup.'
    },
    notes: [], docs: []
  },
  {
    id: 'p08',
    num: '08',
    name: 'Auto Conduite',
    status: 'Blocked',
    statusDetail: 'Agreed to redo but devs busy. Allocate time.',
    devIds: ['badr'],
    agent: 'Coordinator',
    nextAction: 'Allocate dev time',
    reason: 'Customers weren\'t satisfied with V1.',
    recommendedSolution: 'Block 2 dev days specifically to finish this to preserve reputation.',
    waGroup: 'Auto Conduite X BHM',
    clientInfo: {
      name: 'Auto Conduite',
      objective: 'Improve UX for their end customers.'
    },
    notes: [], docs: []
  },
  {
    id: 'p07_ousman',
    num: '07',
    name: 'Ousman X Big House Marketing',
    status: 'To Close',
    statusDetail: 'Il a mis en pause son site sécurité pour travailler sur la boîte de bouteilles d\'eau. Le site est fini.',
    devIds: ['asmae'],
    agent: 'Coordinator',
    nextAction: 'Se mettre d\'accord avec lui sur le nom de domaine',
    websiteLink: 'https://papayawhip-camel-993941.hostingersite.com/',
    waGroup: 'Ousman X BHM',
    clientInfo: {
      name: 'Ousman',
      objective: 'Validation of details and domain connection.'
    },
    notes: [], docs: []
  },
  {
    id: 'p09_monolyth',
    num: '09',
    name: 'Monolyth X Big House Marketing',
    status: 'Waiting Client',
    statusDetail: 'On a fait tous les changements, il continue à en demander, mais il disparaît.',
    devIds: ['asmae', 'badr'],
    agent: 'Communicator',
    nextAction: 'Connecter le nom de domaine',
    websiteLink: 'https://aquamarine-raven-391-664646.hostingersite.com/',
    waGroup: 'Monolyth X BHM',
    clientInfo: {
      name: 'Monolyth',
      objective: 'Launch site'
    },
    notes: [], docs: []
  },
  {
    id: 'p10_chill',
    num: '10',
    name: 'Chill Spa X Big House Marketing',
    status: 'Waiting Client',
    statusDetail: 'Elle a un funnel, on a fait tout ce qu\'elle voulait mais elle disparaît.',
    devIds: ['badr', 'mahdi_dev'],
    agent: 'Communicator',
    nextAction: 'Create subdomain from Tricopigmentation-paris.fr',
    websiteLink: 'https://pink-flamingo-344226.hostingersite.com/',
    waGroup: 'Chill Spa X BHM',
    clientInfo: {
      name: 'Chill Spa',
      objective: 'Finalize touches on funnel'
    },
    notes: [], docs: []
  },
  {
    id: 'p11_exquis',
    num: '11',
    name: 'EXQUIS SERVICES X Big House Marketing',
    status: 'Ghost',
    statusDetail: 'On a fini son site et il a juste disparu.',
    devIds: [],
    agent: 'Communicator',
    nextAction: 'Follow up',
    websiteLink: 'https://lightgrey-jackal-361120.hostingersite.com/',
    waGroup: 'EXQUIS SERVICES X BHM',
    clientInfo: {
      name: 'EXQUIS SERVICES',
      objective: 'Connect domain and launch'
    },
    notes: [], docs: []
  },
  {
    id: 'p14_dounia',
    num: '14',
    name: 'Dounia LAAL X Big House Marketing',
    status: 'Waiting Client',
    statusDetail: 'On a fini son site, c\'est validé, mais elle veut le transférer sur son propre hosting.',
    devIds: ['badr'],
    agent: 'Communicator',
    nextAction: 'Transfer to her own hosting',
    websiteLink: 'https://wheat-ram-554107.hostingersite.com/',
    waGroup: 'Dounia LAAL X BHM',
    clientInfo: {
      name: 'Dounia LAAL',
      objective: 'Site transfer'
    },
    notes: [], docs: []
  },
  {
    id: 'p16_ethnic',
    num: '16',
    name: 'Ethnic Cosmethic - Étile Didier',
    status: 'Ghost',
    statusDetail: 'On a fait le site, ils ont dit qu\'ils allaient nous donner des changements et ils ont disparu.',
    devIds: [],
    agent: 'Communicator',
    nextAction: 'Follow up',
    websiteLink: 'https://ghostwhite-mantis-670892.hostingersite.com/',
    waGroup: 'Ethnic Cosmethic X BHM',
    clientInfo: {
      name: 'Étile Didier',
      objective: 'Apply client changes'
    },
    notes: [], docs: []
  },
  {
    id: 'p17_doriane',
    num: '17',
    name: 'Doriane X Big House Marketing',
    status: 'Ghost',
    statusDetail: 'On a fait son funnel, elle a adoré mais elle a disparu.',
    devIds: [],
    agent: 'Communicator',
    nextAction: 'Collect remaining info to finalize',
    websiteLink: 'https://snow-magpie-335064.hostingersite.com/',
    waGroup: 'Doriane X BHM',
    clientInfo: {
      name: 'Doriane',
      objective: 'Finalize funnel'
    },
    notes: [], docs: []
  },
  {
    id: 'p18_anitta',
    num: '18',
    name: 'ANITTA X BIG HOUSE',
    status: 'Ghost',
    statusDetail: 'On a fait son site mais elle a disparu.',
    devIds: [],
    agent: 'Communicator',
    nextAction: 'Collect list of dishes and prices',
    websiteLink: 'https://lien.bighousemarketing.lu/details-des-produits',
    waGroup: 'ANITTA X BHM',
    clientInfo: {
      name: 'ANITTA',
      objective: 'Wait for menu details'
    },
    notes: [], docs: []
  },
  {
    id: 'p19_quamtys',
    num: '19',
    name: 'Quamtys sàrl X Big House',
    status: 'Blocked',
    statusDetail: 'On a fait le site mais il veut des changements sans nous dire lesquels.',
    devIds: [],
    agent: 'Commander',
    nextAction: 'Push client for specific change requests',
    reason: 'Client wants changes but hasn\'t specified them',
    websiteLink: 'https://lawngreen-gazelle-759853.hostingersite.com/',
    waGroup: 'Quamtys sàrl X BHM',
    clientInfo: {
      name: 'Quamtys sàrl',
      objective: 'Apply changes'
    },
    notes: [], docs: []
  },
  {
    id: 'p21_hanane',
    num: '21',
    name: 'Hanane X Big House Marketing',
    status: 'Ghost',
    statusDetail: 'On a fait son site et elle a disparu.',
    devIds: [],
    agent: 'Communicator',
    nextAction: 'Follow up',
    websiteLink: 'https://lightgoldenrodyellow-herring-810149.hostingersite.com/',
    waGroup: 'Hanane X BHM',
    clientInfo: {
      name: 'Hanane',
      objective: 'Deliver site'
    },
    notes: [], docs: []
  },
  {
    id: 'p24_piazza',
    num: '24',
    name: 'Groupe Ste Piazza',
    status: 'Waiting Client',
    statusDetail: 'Le site est fait, il manque juste la validation finale et le domaine.',
    devIds: [],
    agent: 'Communicator',
    nextAction: 'Final validation and domain',
    websiteLink: 'https://mintcream-gerbil-411795.hostingersite.com/',
    waGroup: 'Groupe Ste Piazza X BHM',
    clientInfo: {
      name: 'Groupe Ste Piazza',
      objective: 'Final validation and domain connection'
    },
    notes: [], docs: []
  },
  {
    id: 'p29_pcs',
    num: '29',
    name: 'PCS - Professional Cleaning Service',
    status: 'Waiting Client',
    statusDetail: 'Le domaine a besoin de docs pour être validé par le gouvernement.',
    devIds: [],
    agent: 'Communicator',
    nextAction: 'Wait for government documents',
    websiteLink: 'http://professionalcleaningservice.ma',
    waGroup: 'PCS X BHM',
    clientInfo: {
      name: 'PCS',
      objective: 'Domain validation'
    },
    notes: [], docs: []
  }
];

export const SERVICES: Service[] = [
  {
    id: 's_ia_1',
    name: 'Site IA One Page',
    price: '€490',
    duration: '1–3 days',
    revisions: '1 round (7 days)',
    tools: ['AI Copyurator', 'Landing Builder', 'Hostinger/Cloudways'],
    resources: ['Intake Form /site-vitrine', 'Vitrine Prompts'],
    process: [
      '1. Client fills T.02 form',
      '2. AI prompt assembles copy + brief',
      '3. Dev integrates in 1-2 days',
      '4. Send delivery WA + Email (T.08)'
    ],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
    fullSop: '# Standard Operating Procedure: Site IA One Page\n\n## 1. Discovery & Intake\n- Ensure client has filled out T.02 Intake Form.\n- Review submitted brand assets, guidelines, and desired outcome.\n\n## 2. AI Copy Generation\n- Use **AI Copyurator** tool with standard `Vitrine Prompts`.\n- Review AI-generated landing page structure and tweak headings, hooks, and CTA.\n\n## 3. Development Phase\n- Set up staging environment on Hostinger/Cloudways.\n- Import base Landing Builder template.\n- Apply generated copy, adjust typography according to brand guidelines.\n- Check responsive breakpoints.\n\n## 4. Delivery & Revision\n- Send preview link via WhatsApp template T.08.\n- Await client feedback (1 round allowed).\n- Implement fixes, migrate to live domain, and complete.'
  },
  {
    id: 's_ia_multi',
    name: 'Site IA Multipage',
    price: '€890',
    duration: '1 week',
    revisions: '2 rounds (10 days)',
    tools: ['AI Copyurator', 'Site Builder', 'Cloudways'],
    resources: ['Intake Form /site-vitrine', 'Multipage Templates'],
    process: [
      '1. T.02 form filled',
      '2. Generate full site map copy',
      '3. Dev builds 5 pages',
      '4. Delivery & Revision tracking'
    ],
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop',
    fullSop: '# Standard Operating Procedure: Site IA Multipage\n\n## 1. Discovery & Intake\n- Verify T.02 form completion.\n- Map out standard 5-page structure: Home, About, Services, Blog/Portfolio, Contact.\n\n## 2. Sitemap & Copy\n- Generate copy for all 5 pages using AI Copyurator.\n- Review internal linking and consistency.\n\n## 3. Development\n- Deploy selected Multipage Template on Cloudways.\n- Build out page structures. Integrate AI copy.\n- Test contact forms and CRM integrations.\n\n## 4. Quality Assurance & Delivery\n- Perform multi-browser testing.\n- Send delivery packet to client.\n- Execute up to 2 rounds of revisions before final sign-off.'
  },
  {
    id: 's_wp_exp',
    name: 'WordPress Présence Express',
    price: '€790',
    duration: '3–5 days',
    revisions: '2 rounds (14 days)',
    tools: ['WordPress', 'Elementor', 'Cloudways'],
    resources: ['Premium Templates (3)', 'WP Admin setup guide'],
    process: [
      '1. Template selection',
      '2. Content gathering',
      '3. Integration',
      '4. Launch checklist'
    ],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2670&auto=format&fit=crop',
    fullSop: '# Standard Operating Procedure: WP Présence Express\n\n## 1. Pre-requisites\n- Client selects from 3 strict Premium Templates.\n- All content (text, images) must be provided upfront.\n\n## 2. Installation\n- Spin up WordPress on Cloudways.\n- Install Elementor Pro and required plugins.\n- Import demo content from the selected template.\n\n## 3. Customization\n- Replace demo content with client content.\n- Adjust global colors and typography in Elementor Site Settings.\n\n## 4. Launch Prep\n- Setup basic SEO plugin.\n- QA functional links and mobile view.\n- Handover with WP Admin setup guide.'
  },
  {
    id: 's_wp_pro',
    name: 'WordPress Business Pro',
    price: '€1,300',
    duration: '2–3 weeks',
    revisions: '3 rounds (21 days)',
    tools: ['WordPress', 'Premium Plugins', 'Cloudways/Kinsta'],
    resources: ['Premium Templates (5)', 'SEO Setup Checklist'],
    process: [
      '1. Discovery check',
      '2. Content & Mockups',
      '3. Full integration',
      '4. SEO & Launch checklist'
    ],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop',
    fullSop: '# Standard Operating Procedure: WP Business Pro\n\n## 1. Project Kickoff\n- Deep dive discovery check on business model.\n- Wireframing customized layouts vs standard templates.\n\n## 2. Content & UX\n- Advanced mockups for key pages (Home, Core Service).\n- Gather or curate professional stock images.\n\n## 3. Advanced Integration\n- Install and configure Premium Plugins (Security, Caching, Forms).\n- Build custom post types if required.\n\n## 4. Optimization & Launch\n- Follow full SEO Setup Checklist.\n- Setup Google Analytics & Search Console.\n- Speed testing and optimization before go-live.'
  },
  {
    id: 's_ecom_base',
    name: 'E-com De Base',
    price: '€1,200',
    duration: '2–3 weeks',
    revisions: '2 rounds (21 days)',
    tools: ['WooCommerce', 'Stripe/PayPal'],
    resources: ['Product Catalog Template', 'E-com Form /site-e-commerce'],
    process: [
      '1. Store setup',
      '2. Payment gateways',
      '3. Add up to 5 products',
      '4. Delivery'
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop',
    fullSop: '# Standard Operating Procedure: E-com De Base\n\n## 1. Store Foundation\n- Validate `/site-e-commerce` intake form.\n- Install WooCommerce and configure base settings (currency, location).\n\n## 2. Design & Products\n- Setup base theme.\n- Use Product Catalog Template to upload up to 5 simple or variable products.\n\n## 3. Payments & Shipping\n- Connect Stripe and/or PayPal.\n- Set up basic flat-rate or free shipping zones.\n\n## 4. Testing & Handoff\n- Run test transactions in staging mode.\n- Deliver store and provide basic order management training.'
  },
  {
    id: 's_ecom_std',
    name: 'E-com Standard',
    price: '€2,500',
    duration: '3–5 weeks',
    revisions: '3 rounds (30 days)',
    tools: ['WooCommerce', 'Advanced Shipping', 'Taxes'],
    resources: ['Standard Ecom Checklists', 'Automations'],
    process: [
      '1. Structuring',
      '2. Dev integration',
      '3. Testing flows',
      '4. Training client'
    ],
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2670&auto=format&fit=crop',
    fullSop: '# Standard Operating Procedure: E-com Standard\n\n## 1. Advanced Architecture\n- Detailed category mapping and product attribute setup.\n- Integration with ERP or advanced inventory sheets if needed.\n\n## 2. Dynamic Integration\n- Complex variable products with swatches.\n- Setup Advanced Shipping rules (weight/dimension based) & live rates.\n- Automatic tax calculation setups.\n\n## 3. Marketing Automations\n- Abandoned cart recovery setup.\n- Email marketing integration (Mailchimp/Klaviyo).\n\n## 4. Go-Live Protocol\n- End-to-end stress testing.\n- Formal client training session on catalog management and fulfillment.'
  }
];
