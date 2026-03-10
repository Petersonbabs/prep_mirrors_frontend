import { EducationFact, Option } from "../onboarding/types";

export const ROLES: Option[] = [
  {
    id: 'swe',
    label: 'Software Engineer',
    emoji: '💻',
    response: {
      headline: 'Smart choice.',
      body: "SWE roles are competitive — but candidates who practice with AI are 3× more likely to get an offer. We'll prep you for exactly the questions top companies ask.",
      stat: 'Structured practice is the #1 differentiator between offers and rejections'
    }
  },
  {
    id: 'pm',
    label: 'Product Manager',
    emoji: '🎯',
    response: {
      headline: 'PM interviews are a different beast.',
      body: 'They test product sense, strategy, and leadership all at once. We\'ll train you to structure answers that make hiring managers say "this person gets it."',
      stat: 'PM interviews test 5 skills at once — we train you on all of them'
    }
  },
  {
    id: 'ds',
    label: 'Data Scientist',
    emoji: '📊',
    response: {
      headline: 'Data roles are booming.',
      body: "But most candidates fail on the communication side — not the technical. We'll make sure you can explain complex work in a way that lands.",
      stat: 'Top skill gap: explaining insights clearly'
    }
  },
  {
    id: 'design',
    label: 'UX/UI Designer',
    emoji: '🎨',
    response: {
      headline: 'Design interviews are part portfolio, part storytelling.',
      body: 'We\'ll help you craft compelling narratives around your work and nail the "walk me through your process" question every time.',
      stat: '72% of designers fail on case study delivery'
    }
  },
  {
    id: 'marketing',
    label: 'Marketing',
    emoji: '📣',
    response: {
      headline: 'Marketing roles reward storytellers.',
      body: "We'll help you quantify your impact and tell stories that connect your past wins to the company's future goals.",
      stat: 'Metrics-driven answers get 2× more callbacks'
    }
  },
  {
    id: 'finance',
    label: 'Finance',
    emoji: '💰',
    response: {
      headline: 'Finance interviews demand precision.',
      body: "Technical knowledge alone won't cut it. We'll sharpen your ability to communicate complex analysis clearly under pressure.",
      stat: '1 in 3 finance candidates fail on soft skills'
    }
  },
  {
    id: 'sales',
    label: 'Sales',
    emoji: '🤝',
    response: {
      headline: 'Sales interviews are performances.',
      body: "They're watching how you sell yourself. We'll coach you to demonstrate the exact qualities top sales leaders look for.",
      stat: 'Confidence is the #1 hiring signal in sales'
    }
  },
  {
    id: 'other',
    label: 'Other Role',
    emoji: '✨',
    response: {
      headline: 'Every role has its interview formula.',
      body: "We'll build a custom practice plan around your specific role, industry, and target companies.",
      stat: 'Custom plans see 40% better outcomes'
    }
  }];

export const LEVELS: Option[] = [
  {
    id: 'student',
    label: 'Student / Fresh Graduate',
    emoji: '🎓',
    response: {
      headline: 'Starting fresh is actually an advantage.',
      body: "You haven't built bad habits yet. We'll build your confidence from zero — with structured practice that turns nervousness into preparation.",
      stat: 'The candidates who land fastest are the most prepared, not the most experienced'
    }
  },
  {
    id: 'junior',
    label: '0 – 2 years experience',
    emoji: '🌱',
    response: {
      headline: 'The early career gap is real — and closeable.',
      body: "Most junior candidates undersell themselves. We'll help you frame your limited experience in a way that shows potential, not inexperience.",
      stat: 'Junior candidates who practice get 2× more offers'
    }
  },
  {
    id: 'mid',
    label: '2 – 5 years experience',
    emoji: '🚀',
    response: {
      headline: "You're at the most competitive level.",
      body: "Mid-level roles attract the most applicants. We'll sharpen your ability to stand out — with stories that show impact, not just activity.",
      stat: 'Mid-level is the most applied-to tier globally'
    }
  },
  {
    id: 'senior',
    label: '5+ years experience',
    emoji: '⭐',
    response: {
      headline: 'Senior interviews test leadership, not just skill.',
      body: 'At your level, they\'re hiring for influence and vision. We\'ll help you articulate the kind of impact that makes hiring managers say "we need this person."',
      stat: '81% of senior hires are decided in the first interview'
    }
  }];

export const CHALLENGES: Option[] = [
  {
    id: 'nerves',
    label: 'I freeze up under pressure',
    emoji: '😰',
    response: {
      headline: "You're not alone — this is the #1 challenge.",
      body: "Nerves aren't a personality flaw. They're a preparation gap. The more you practice in a realistic environment, the more your brain learns that interviews are safe.",
      stat: '78% of candidates say nerves are their biggest obstacle'
    }
  },
  {
    id: 'structure',
    label: 'I ramble and lose my thread',
    emoji: '🌀',
    response: {
      headline: 'Interviewers decide in the first 2 minutes.',
      body: "Rambling is a structure problem, not a knowledge problem. We'll train you on frameworks like STAR and PREP until structured answers feel completely natural.",
      stat: 'Structured answers are rated 40% more favorably'
    }
  },
  {
    id: 'technical',
    label: 'Technical questions trip me up',
    emoji: '🧩',
    response: {
      headline: 'Technical gaps are the most fixable.',
      body: 'We\'ll identify exactly which areas you\'re weakest in and build targeted practice sessions around them — with an AI coach that explains the "why" behind every answer.',
      stat: 'Targeted practice closes skill gaps 3× faster'
    }
  },
  {
    id: 'behavioral',
    label: 'I struggle with behavioral questions',
    emoji: '🗣️',
    response: {
      headline: 'Behavioral questions are about storytelling.',
      body: "Most people fail because they haven't prepared their stories in advance. We'll help you build a personal story bank — so you're never caught off guard.",
      stat: '60% of rejections happen in the behavioral round'
    }
  },
  {
    id: 'confidence',
    label: 'I doubt myself mid-interview',
    emoji: '🪞',
    response: {
      headline: 'Self-doubt is a signal, not a verdict.',
      body: 'It means you care. PrepMirrors turns that care into competence — with real feedback that shows you exactly how good you already are, and where to grow.',
      stat: 'Most people feel noticeably more confident after just a few realistic practice sessions'
    }
  },
  {
    id: 'experience',
    label: "I don't have enough experience",
    emoji: '📋',
    response: {
      headline: 'Experience is relative. Framing is everything.',
      body: "We'll teach you to present what you have in a way that shows potential, transferable skills, and growth mindset — the things great companies actually hire for.",
      stat: 'Framing beats experience in 70% of entry-level hires'
    }
  }];

export const TIMELINES: Option[] = [
  {
    id: 'this-week',
    label: 'This week',
    emoji: '🔥',
    response: {
      headline: "That's tight — but absolutely doable.",
      body: "We'll skip the fluff and focus on the highest-impact questions first. One focused session today can change everything.",
      stat: 'Users who practice 3+ times before an interview are 2× more likely to pass'
    }
  },
  {
    id: 'this-month',
    label: 'Within a month',
    emoji: '📅',
    response: {
      headline: 'A month is the perfect runway.',
      body: "Enough time to build real confidence without losing urgency. We'll create a daily practice plan that fits around your life.",
      stat: '30 days of consistent practice = interview-ready'
    }
  },
  {
    id: 'exploring',
    label: 'Just exploring for now',
    emoji: '🔭',
    response: {
      headline: 'The best time to prepare is before you need to.',
      body: "Candidates who start practicing early are 4× more confident when the real opportunity arrives. No pressure — we'll be here when you're ready.",
      stat: 'Early preparers get 40% more callbacks'
    }
  },
  {
    id: 'no-offer',
    label: "I've been rejected before",
    emoji: '💔',
    response: {
      headline: 'Rejection is data, not destiny.',
      body: "Every rejection points to a specific gap. We'll help you identify exactly what went wrong and fix it — so the next interview goes differently.",
      stat: 'Every rejection points to a specific, fixable gap — we help you find and close it'
    }
  }];

export const ROLE_FACTS: Record<string, EducationFact> = {
  swe: {
    emoji: '🏢',
    label: 'Did you know?',
    headline:
      'Top tech companies reject 95% of applicants — but not for the reasons you think.',
    body: "Google, Meta, and Amazon reject most candidates not because they lack technical skill, but because they can't communicate their thinking clearly under pressure.",
    source: 'Source: Google Hiring Research, 2023'
  },
  pm: {
    emoji: '🎯',
    label: 'Did you know?',
    headline: 'PM interviews test 5 different skills simultaneously.',
    body: 'Product sense, analytical thinking, execution, leadership, and communication — all in a single 45-minute conversation. Most candidates prepare for only one or two.',
    source: 'Source: Exponent PM Interview Study'
  },
  ds: {
    emoji: '📊',
    label: 'Did you know?',
    headline:
      'Data Scientists fail interviews for non-technical reasons 60% of the time.',
    body: "The #1 reason data scientists get rejected isn't their SQL or Python — it's their inability to explain findings to non-technical stakeholders.",
    source: 'Source: Kaggle Data Science Survey'
  },
  design: {
    emoji: '🎨',
    label: 'Did you know?',
    headline:
      'Design interviewers make their decision in the first 10 minutes.',
    body: "Before you've even finished your first case study, most interviewers have formed an impression. The opening — how you frame the problem — is everything.",
    source: 'Source: IDEO Design Research'
  },
  marketing: {
    emoji: '📣',
    label: 'Did you know?',
    headline:
      'Marketing candidates who quantify their impact get 2× more offers.',
    body: '"I grew our email list" lands very differently from "I grew our email list by 40% in 3 months, driving $120K in attributed revenue."',
    source: 'Source: LinkedIn Talent Insights'
  },
  finance: {
    emoji: '💰',
    label: 'Did you know?',
    headline: 'Finance interviews are 40% technical, 60% judgment.',
    body: "Senior finance leaders aren't just hiring for spreadsheet skills. They're hiring for the judgment to know which numbers matter.",
    source: 'Source: CFA Institute Career Report'
  },
  sales: {
    emoji: '🤝',
    label: 'Did you know?',
    headline: 'The best sales interview answer is a mini sales pitch.',
    body: 'Top sales candidates treat the interview itself as a sales call — they qualify the interviewer, understand their pain points, and position themselves as the solution.',
    source: 'Source: Salesforce State of Sales'
  },
  other: {
    emoji: '✨',
    label: 'Did you know?',
    headline: 'Transferable skills win more interviews than you think.',
    body: 'Hiring managers consistently rank communication, problem-solving, and adaptability above domain-specific experience for most roles.',
    source: 'Source: World Economic Forum Future of Jobs'
  }
};
export const LEVEL_FACTS: Record<string, EducationFact> = {
  student: {
    emoji: '🎓',
    label: 'Did you know?',
    headline:
      'Entry-level candidates who practice interviews get 3× more offers.',
    body: 'A study of 2,000 new graduates found that those who completed at least 5 mock interviews before applying were 3× more likely to receive an offer.',
    source: 'Source: NACE Graduate Outcomes Survey'
  },
  junior: {
    emoji: '🌱',
    label: 'Did you know?',
    headline:
      'Junior candidates undersell themselves in 7 out of 10 interviews.',
    body: 'Research shows that junior candidates consistently undervalue their experience, using hedging language like "I only did..." or "It was just a small project."',
    source: 'Source: LinkedIn Economic Graph Research'
  },
  mid: {
    emoji: '🚀',
    label: 'Did you know?',
    headline:
      'Mid-level roles receive 3× more applications than any other tier.',
    body: 'The 2-5 year experience band is the most competitive in the job market. Standing out requires more than a good resume — it requires a compelling narrative.',
    source: 'Source: Indeed Hiring Lab'
  },
  senior: {
    emoji: '⭐',
    label: 'Did you know?',
    headline:
      'Senior candidates are evaluated on leadership stories, not technical answers.',
    body: 'For senior roles, interviewers spend 70% of their evaluation time on behavioral questions about influence, conflict, and team outcomes.',
    source: 'Source: Harvard Business Review Hiring Study'
  }
};
export const CHALLENGE_FACTS: Record<string, EducationFact> = {
  nerves: {
    emoji: '🧠',
    label: 'Did you know?',
    headline:
      "Interview anxiety is a physiological response — and it's trainable.",
    body: "When you're nervous, your brain enters a threat state that impairs working memory and verbal fluency. The only way to retrain this response is repeated exposure to realistic interview conditions.",
    source: 'Source: Journal of Applied Psychology'
  },
  structure: {
    emoji: '⏱️',
    label: 'Did you know?',
    headline: 'Interviewers form their impression in the first 90 seconds.',
    body: 'Research from the University of Toronto found that most interviewers make their hire/no-hire decision within the first 90 seconds — and spend the rest of the interview confirming it.',
    source: 'Source: University of Toronto, 2022'
  },
  technical: {
    emoji: '🔧',
    label: 'Did you know?',
    headline:
      'Thinking out loud is more important than getting the right answer.',
    body: 'In technical interviews, 60% of the evaluation score comes from how you approach the problem — not whether you solve it.',
    source: 'Source: Google Engineering Hiring Data'
  },
  behavioral: {
    emoji: '📖',
    label: 'Did you know?',
    headline: '60% of interview rejections happen in the behavioral round.',
    body: 'Most candidates prepare their technical skills and neglect behavioral questions. Yet behavioral rounds are where the majority of rejections happen.',
    source: 'Source: SHRM Interview Research'
  },
  confidence: {
    emoji: '🪞',
    label: 'Did you know?',
    headline: 'Confidence is perceived before you say a single word.',
    body: 'Studies show that 55% of the impression you make in an interview comes from non-verbal signals — posture, eye contact, pace of speech — before your actual answer is evaluated.',
    source: 'Source: Albert Mehrabian Communication Research'
  },
  experience: {
    emoji: '🔄',
    label: 'Did you know?',
    headline: 'Hiring managers hire for potential 70% of the time.',
    body: 'A McKinsey study found that for most roles below senior level, hiring managers weight "potential and trajectory" more heavily than current experience.',
    source: 'Source: McKinsey Global Institute'
  }
};
export const TIMELINE_FACTS: Record<string, EducationFact> = {
  'this-week': {
    emoji: '⚡',
    label: 'Did you know?',
    headline: 'Even one focused practice session can change your outcome.',
    body: 'Research on interview preparation shows that a single structured practice session — with feedback — improves performance by an average of 26%.',
    source: 'Source: Journal of Vocational Behavior'
  },
  'this-month': {
    emoji: '📅',
    label: 'Did you know?',
    headline: '21 days of practice creates a new habit — and a new identity.',
    body: 'Neuroplasticity research shows that 21 days of consistent practice is enough to rewire how your brain responds to a stressful situation.',
    source: 'Source: European Journal of Social Psychology'
  },
  exploring: {
    emoji: '🔭',
    label: 'Did you know?',
    headline: 'The best time to prepare is 6 weeks before you need to.',
    body: "Candidates who start interview prep before they're actively job hunting are 4× more confident and 2× more likely to negotiate salary when an offer comes.",
    source: 'Source: LinkedIn Career Insights'
  },
  'no-offer': {
    emoji: '💡',
    label: 'Did you know?',
    headline: '84% of rejected candidates were rejected for fixable reasons.',
    body: 'A post-interview analysis of 5,000 rejections found that 84% were due to specific, addressable issues: poor answer structure, lack of concrete examples, or weak opening statements.',
    source: 'Source: Greenhouse Recruiting Analytics'
  }
};