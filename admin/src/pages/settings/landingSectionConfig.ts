import { resolveMediaUrl } from '../../utils/apiBase';

export interface HeroConfig {
  title: string;
  subline: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  badgeText: string;
  bgImage: string;
}

export interface WhyChooseItem {
  number: string;
  title: string;
  description: string;
  image: string;
}

export interface WhyChooseConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: WhyChooseItem[];
}

export const DEFAULT_HERO: HeroConfig = {
  title: 'Empowering Minds. Inspiring Excellence.',
  subline: 'Comprehensive learning programs designed to build strong foundations, deep clarity, and lasting habits.',
  primaryCtaText: 'Browse Programs',
  primaryCtaLink: '/courses',
  secondaryCtaText: 'Talk to an Advisor',
  secondaryCtaLink: 'https://wa.me/919999999999',
  badgeText: 'MERIDIAN GROUP OF EDUCATION',
  bgImage: '/meridian/hero_bg_1.png',
};

export type LandingStatsTone = 'gold' | 'warm' | 'sky' | 'lavender';

export interface LandingStatsMetric {
  value: string;
  label: string;
  tone: LandingStatsTone;
}

export interface LandingStatsConfig {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  metrics: LandingStatsMetric[];
}

export interface StatementCard {
  index: string;
  before: string;
  accent: string;
  after: string;
  image: string;
  imageAlt: string;
}

export interface LandingStatementConfig {
  items: StatementCard[];
}

export interface LandingTestimonialsConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const DEFAULT_LANDING_TESTIMONIALS: LandingTestimonialsConfig = {
  eyebrow: 'Student & parent voices',
  title: 'Trusted by families and learners',
  subtitle:
    'Short notes from people who study with us—what shifted in confidence, clarity, and habits.',
};

export const DEFAULT_LANDING_STATS: LandingStatsConfig = {
  title: 'Outcomes families can feel',
  subtitle:
    'Learners, mentors, and programs in one picture—clear signals of how Meridian shows up day to day.',
  image: '/meridian/stats_community.jpg',
  imageAlt: 'Students collaborating with a laptop in front of bookshelves.',
  metrics: [
    { value: '2,500+', label: 'Active learners', tone: 'gold' },
    { value: '40+', label: 'Programs and courses', tone: 'warm' },
    { value: '98%', label: 'Positive support experience', tone: 'sky' },
    { value: '4.9', label: 'Average learner rating', tone: 'lavender' },
  ],
};

export const LANDING_STATS_TONE_OPTIONS: { value: LandingStatsTone; label: string }[] = [
  { value: 'gold', label: 'Gold (amber)' },
  { value: 'warm', label: 'Warm (rose)' },
  { value: 'sky', label: 'Sky (blue)' },
  { value: 'lavender', label: 'Lavender (violet)' },
];

export const DEFAULT_LANDING_STATEMENT: LandingStatementConfig = {
  items: [
    {
      index: '01',
      before: 'Education that pairs',
      accent: 'structure',
      after: ' with empathy—so learners gain confidence, clarity, and momentum.',
      image: '/meridian/statement-01.jpg',
      imageAlt: 'Student working at a desk with a laptop and open notebook.',
    },
    {
      index: '02',
      before: 'Support that stays',
      accent: 'personal',
      after: '—small groups, clear feedback, and room to ask every question.',
      image: '/meridian/statement-02.jpg',
      imageAlt: 'Learners collaborating around a table during a small-group session.',
    },
    {
      index: '03',
      before: 'Growth that feels',
      accent: 'steady',
      after: '—independent thinking, resilient habits, and momentum that lasts.',
      image: '/meridian/statement-03.jpg',
      imageAlt: 'Students studying together in a bright workshop space.',
    },
  ],
};

export const DEFAULT_WHY_CHOOSE: WhyChooseConfig = {
  eyebrow: 'WHY MERIDIAN',
  title: 'A structured, calm path to real academic mastery.',
  subtitle: 'We replaced frantic cramming with predictable routines, expert mentorship, and measured confidence.',
  items: [
    {
      number: '01',
      title: 'Predictable weekly rhythm',
      description: 'Topic goals, guided problem-solving, and scheduled checkpoints so students never guess what comes next.',
      image: '/meridian/diary/cohort.jpg',
    },
    {
      number: '02',
      title: 'Faculty who teach the "why"',
      description: 'Mentors who break complex questions down into first principles, giving learners tools that outlast the exam.',
      image: '/meridian/diary/workshop.jpg',
    },
    {
      number: '03',
      title: 'Signal over noise',
      description: 'Curated problems, targeted homework, and focused revision sheets instead of overwhelming question banks.',
      image: '/meridian/statement-01.jpg',
    },
    {
      number: '04',
      title: 'Peer cohort momentum',
      description: 'Small groups where serious learners compare solutions, share notes, and keep each other accountable.',
      image: '/meridian/statement-02.jpg',
    },
    {
      number: '05',
      title: 'Transparent parent updates',
      description: 'Objective data on attendance, quiz trends, and concept gaps—so support starts before confidence slips.',
      image: '/meridian/stats_community.jpg',
    },
  ],
};

export const resolveImgPreview = (url: string) => resolveMediaUrl(url);