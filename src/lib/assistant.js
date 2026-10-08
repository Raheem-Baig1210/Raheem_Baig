// Rule-based "AI" for the /ask page. Works out what the visitor is asking about
// and composes a markdown-ish answer from the portfolio data, so answers stay
// in sync with src/data/profile.js. Supported markup: **bold**, [label](href),
// "- " bullet lines and blank-line paragraphs.
import { profile, origin, stack, experience, projects, education, certifications } from '../data/profile.js'

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// Keyword match at a word start (so "educat" matches "education" but "age" doesn't match "page").
const has = (q, kw) => new RegExp(`(^|[^a-z0-9])${escape(kw)}`).test(q)
const hasWord = (q, kw) => new RegExp(`(^|[^a-z0-9])${escape(kw)}($|[^a-z0-9])`).test(q)
const list = (items) => items.map((i) => `- ${i}`).join('\n')
const join = (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`)

const languagesSpoken = origin.facts.find(([k]) => k === 'Languages')?.[1] ?? 'English'

// ---------- intents: keyword → weight ----------
const INTENTS = {
  education: ['educat', 'degree', 'college', 'universit', 'studied', 'study', 'studies', 'graduat', 'qualif', 'bachelor', 'b.e', 'osmania', 'narayana', 'coursework', 'academic', 'school'],
  experience: ['experien', 'work', 'job', 'compan', 'career', 'employ', 'intern', 'position', 'professional', 'role', ['years', 0.5]],
  skills: ['skill', 'stack', 'tech', 'tool', 'framework', 'librar', 'programming', 'proficien', 'expert', 'good at', 'strength', 'capab', 'frontend', 'backend', 'database', 'cloud', 'devops', ['know', 0.5], ['language', 0.5]],
  projects: ['project', 'built', 'build', 'portfolio', 'app', 'website', 'site', 'made', 'creat', 'showcase', 'e-commerce', 'ecommerce', ['develop', 0.5]],
  freelance: [['freelanc', 2], ['client', 1], ['dubai', 1], ['uae', 1], ['saudi', 1]],
  certifications: [['certif', 2], 'course', 'coursera', 'credential', 'badge', 'claude 101', 'ai fluency', 'cyber', 'security', ['anthropic', 1.5], ['google', 1]],
  contact: [['contact', 2], 'email', 'e-mail', 'mail', 'phone', 'number', 'call', 'whatsapp', 'reach', 'connect', 'linkedin', 'github', 'social', 'message', 'dm'],
  hire: [['hire', 2], 'hiring', 'availab', 'open to', 'opportunit', 'recruit', 'job offer', 'join', 'relocat', 'remote', 'notice period'],
  location: [['where', 0.6], 'locat', 'based', 'live', 'city', 'country', 'hyderabad', 'india', ['from', 0.4]],
  spoken: [['speak', 2], 'spoken', 'english', 'hindi', 'urdu', 'mother tongue', 'fluent'],
  resume: [['resume', 2], ['cv', 2], 'curriculum'],
  current: [['current', 1.5], ['now', 1], ['present', 1], 'these days', 'at the moment'],
  personal: ['age', 'how old', 'birthday', 'born', 'married', 'wife', 'girlfriend', 'religion', 'hobby', 'hobbies', 'salary', 'ctc', 'expected pay', 'weight', 'height'],
  about: [['who', 1], 'yourself', 'himself', 'introduc', 'summary', 'overview', 'background', 'bio', ['about', 0.5], 'raheem'],
}

function score(q) {
  const scores = {}
  for (const [intent, kws] of Object.entries(INTENTS)) {
    scores[intent] = kws.reduce((s, kw) => {
      const [k, w] = Array.isArray(kw) ? kw : [kw, 1]
      return s + (has(q, k) ? w : 0)
    }, 0)
  }
  return scores
}

// ---------- specific entities ----------
const projectAliases = projects.map((p) => {
  const name = norm(p.name).replace(/[^a-z0-9 ]/g, '')
  const words = name.split(' ')
  const aliases = new Set([name, p.slug.replace(/-/g, ' '), words.slice(0, 2).join(' ')])
  // Any distinctive single word ("ozhan", "mestar", "bizflow"), skipping generic ones.
  const generic = ['school', 'system', 'perfumes', 'energy', 'global', 'supply', 'technical', 'services', 'tours', 'travels', 'center', 'application']
  for (const w of words) if (w.length > 3 && !generic.includes(w)) aliases.add(w)
  return { project: p, aliases: [...aliases] }
})
const findProject = (q) => projectAliases.find(({ aliases }) => aliases.some((a) => hasWord(q, a)))?.project

// "the perfume project", "your e-commerce work": match words against each project's name, kind and tags.
const TOPIC_STOP = ['project', 'projects', 'about', 'tell', 'website', 'websites', 'details', 'which', 'there', 'their', 'built', 'build', 'show', 'what', 'where', 'other', 'please']
function findProjectsByTopic(q) {
  const words = q.split(/[^a-z0-9]+/).filter((w) => w.length >= 5 && !TOPIC_STOP.includes(w))
  if (!words.length) return []
  return projects.filter((p) => {
    const text = norm(`${p.name} ${p.kind} ${p.tags.join(' ')}`).replace(/-/g, '')
    return words.some((w) => has(text, w.replace(/s$/, '')))
  })
}

const companyAliases = { 'namya-it': ['namya'], 'career-guidance-council': ['career guidance', 'cgc'] }
const findJob = (q) => experience.find((e) => (companyAliases[e.slug] || []).some((a) => has(q, a)))

const techAliases = stack.flatMap(({ group, items }) =>
  items.map((item) => {
    const base = norm(item).replace(/\s*\(.*\)/, '').trim()
    const aliases = new Set([base, base.replace(/\.js$/, ''), base.replace(/\./g, ''), base.replace(/\s+/g, '')])
    if (base === 'nestjs') aliases.add('nest')
    if (base === 'mongodb') aliases.add('mongo')
    if (base === 'aws') aliases.add('ec2')
    if (base === 'tailwind css') aliases.add('tailwind')
    if (base === 'postgresql') aliases.add('postgres')
    if (base === 'jwt auth') aliases.add('jwt')
    if (base === 'teamwork') ['team player', 'team work', 'collaborat'].forEach((a) => aliases.add(a))
    if (base === 'leadership') ['leader', 'lead a team'].forEach((a) => aliases.add(a))
    if (base === 'problem-solving') ['problem solving', 'problem solver', 'solve problems'].forEach((a) => aliases.add(a))
    if (base === 'self-learner') ['self learner', 'fast learner', 'quick learner', 'learn new'].forEach((a) => aliases.add(a))
    if (base === 'detail-oriented') ['detail oriented', 'attention to detail'].forEach((a) => aliases.add(a))
    if (base === 'agile methodologies') ['agile', 'scrum'].forEach((a) => aliases.add(a))
    return { item, group, aliases: [...aliases].filter((a) => a.length > 1) }
  })
)
const findTechs = (q) => techAliases.filter(({ aliases }) => aliases.some((a) => hasWord(q, a)))

// Words visitors use for things that aren't in the stack.
const UNKNOWN_TECH = ['angular', 'vue', 'svelte', 'django', 'flask', 'laravel', 'php', 'ruby', 'rails', 'golang', 'rust', 'kotlin', 'swift', 'flutter', 'react native', 'android', 'ios', 'azure', 'gcp', 'kubernetes', 'docker', 'graphql', 'redis', 'firebase', 'mysql', 'c#', 'spring']
const findUnknownTech = (q) => UNKNOWN_TECH.find((t) => hasWord(q, t))

// ---------- answers ----------
const ANSWERS = {
  about: () => [
    `**${profile.fullName}** is a **Software Developer & Full Stack Developer** based in Hyderabad, India. He currently works at **Namya IT**, building full-stack web apps with the MERN stack, Next.js, NestJS and TypeScript.`,
    list([
      `**Education:** B.E. in Computer Science and Engineering, Osmania University (${education[0].date})`,
      `**Experience:** ${experience.map((e) => `${e.company} (${e.period})`).join(' · ')}`,
      `**Projects:** ${projects.length} shipped, including ${join(projects.slice(0, 3).map((p) => `[${p.name}](/projects/${p.slug})`))}`,
      `**Certifications:** ${certifications.length}, from Anthropic and Google`,
    ]),
    `He cares about clean, maintainable backends, secure authentication and interfaces people enjoy using. Want to dig into his experience, projects or skills?`,
  ],

  education: () => [
    `Here's Raheem's education:`,
    list(education.map((e) => `**${e.title}**, ${e.org} (${e.date})`)),
    `His coursework covered **MERN Stack Development, Software Engineering, Computer Networking** and **Data Structures and Algorithms**. He's also earned ${certifications.length} [certifications](/certifications) since then.`,
  ],

  experience: () => [
    `Raheem has ${experience.length} professional roles so far:`,
    ...experience.map((e) =>
      [`**${e.role}**, ${e.company} · ${e.period}`, list(e.points.slice(0, 2))].join('\n\n')
    ),
    `See the full details on the [experience page](/experience).`,
  ],

  current: () => {
    const now = experience.find((e) => /present/i.test(e.period)) || experience[0]
    return [
      `Right now Raheem is a **${now.role}** at **${now.company}** (${now.period}), in ${now.location}.`,
      list(now.points),
      `Tech he uses there: ${now.tags.join(', ')}.`,
    ]
  },

  skills: () => [
    `Here's Raheem's tech stack:`,
    list(stack.map((g) => `**${g.group}:** ${g.items.join(', ')}`)),
    `His strongest area is **full-stack JavaScript/TypeScript**: React and Next.js on the front end, Node.js, Express and NestJS on the back end, with MongoDB or PostgreSQL. More on the [stack page](/stack).`,
  ],

  projects: () => [
    `Raheem has shipped **${projects.length} projects**. Here they are, most recent and notable first:`,
    list(projects.map((p) => `[${p.name}](/projects/${p.slug}): ${p.kind}${p.live ? ` · [live ↗](${p.live})` : ''}`)),
    `Ask me about any one of them, e.g. "Tell me about Al Özhan Perfumes".`,
  ],

  freelance: () => {
    const fl = projects.filter((p) => /freelance/i.test(p.kind))
    return [
      `Yes, Raheem takes on freelance work. Projects he's delivered for clients include:`,
      list(fl.map((p) => `[${p.name}](/projects/${p.slug}): ${p.description.split('. ')[0]}.`)),
      `He's open to new freelance projects, so feel free to [send him a message](/collab).`,
    ]
  },

  certifications: () => [
    `Raheem holds **${certifications.length} certifications**:`,
    list(certifications.map((c) => `**${c.title}**, ${c.issuer}${c.date ? ` (${c.date})` : ''}`)),
    `You can view each certificate on the [certifications page](/certifications).`,
  ],

  contact: () => [
    `You can reach Raheem through any of these:`,
    list([
      `**Email:** [${profile.email}](mailto:${profile.email})`,
      `**Phone / WhatsApp:** [${profile.phone}](${profile.whatsapp})`,
      `**LinkedIn:** [raheem-baig](${profile.linkedin})`,
      `**GitHub:** [${profile.githubUser}](${profile.github})`,
    ]),
    `Or just use the [contact form](/collab). It goes straight to his inbox.`,
  ],

  hire: () => [
    `Yes, Raheem is **open to opportunities**: full-time Software Engineer / Full Stack roles, as well as freelance projects.`,
    `He's currently at **Namya IT** working on MERN, Next.js and NestJS apps, and brings hands-on experience with secure auth, REST APIs and production deployments.`,
    `The quickest way to start a conversation is the [contact form](/collab) or email at [${profile.email}](mailto:${profile.email}). You can also [download his resume](${profile.resume}).`,
  ],

  location: () => [
    `Raheem is based in **Hyderabad, India** (Golconda area). His local time is IST (UTC +05:30), shown in the bottom-right corner of this site.`,
    `He has also delivered freelance work for clients in the **UAE** and **Saudi Arabia**, so working remotely across time zones is familiar to him.`,
  ],

  spoken: () => [`Raheem speaks **${languagesSpoken}**: fluent in English, and native in Hindi and Urdu.`],

  resume: () => [
    `Sure! You can [download Raheem's resume](${profile.resume}) (PDF).`,
    `For a quick overview: **Software Developer at Namya IT**, previously a **Full Stack Developer at Career Guidance Council**, with a **B.E. in Computer Science** from Osmania University.`,
  ],

  personal: () => [
    `That's a bit personal, so I don't have that information. I only know about Raheem's professional side: education, experience, skills, projects and certifications.`,
    `For anything else, you can ask him directly at [${profile.email}](mailto:${profile.email}).`,
  ],
}

const SUGGEST = {
  about: ['What are his skills?', 'Where has he worked?', 'Show me his projects'],
  education: ['What certifications does he have?', 'Where has he worked?', 'What are his skills?'],
  experience: ['What is he doing currently?', 'Show me his projects', 'What are his skills?'],
  current: ['Where did he work before?', 'What are his skills?', 'Is he open to opportunities?'],
  skills: ['Does he know TypeScript?', 'Show me his projects', 'Where has he worked?'],
  projects: ['Tell me about Al Özhan Perfumes', 'Has he done freelance work?', 'What are his skills?'],
  freelance: ['How can I contact him?', 'Show me all his projects', 'What are his skills?'],
  certifications: ['What did he study?', 'What are his skills?', 'Show me his projects'],
  contact: ['Is he open to opportunities?', 'Can I see his resume?', 'Where is he based?'],
  hire: ['How can I contact him?', 'What are his skills?', 'Show me his projects'],
  location: ['Is he open to remote work?', 'How can I contact him?', 'Where has he worked?'],
  spoken: ['Where is he based?', 'How can I contact him?', 'Tell me about yourself'],
  resume: ['How can I contact him?', 'Where has he worked?', 'What are his skills?'],
  personal: ['Tell me about yourself', 'What are his skills?', 'How can I contact him?'],
  project: ['Show me all his projects', 'What are his skills?', 'How can I contact him?'],
  job: ['What is he doing currently?', 'Show me his projects', 'What are his skills?'],
  tech: ['What are all his skills?', 'Show me his projects', 'Where has he worked?'],
  fallback: ['Tell me about yourself', 'What are his skills?', 'Show me his projects'],
}

function projectAnswer(p) {
  return [
    `**${p.name}** (${p.kind})`,
    p.description,
    p.points ? list(p.points) : null,
    `**Tech:** ${p.tags.join(', ')}`,
    [p.live && `[Visit the live site ↗](${p.live})`, p.repo && `[Source on GitHub ↗](${p.repo})`, `[Open in portfolio](/projects/${p.slug})`]
      .filter(Boolean)
      .join(' · '),
  ].filter(Boolean)
}

function jobAnswer(e) {
  return [
    `At **${e.company}**, Raheem works as a **${e.role}** (${e.period}, ${e.location}).`.replace(
      'works',
      /present/i.test(e.period) ? 'works' : 'worked'
    ),
    list(e.points),
    `**Tech used:** ${e.tags.join(', ')}`,
  ]
}

function techAnswer(techs) {
  return techs.flatMap(({ item, group }) => {
    const key = norm(item).replace(/\s*\(.*\)/, '').replace(/\.js$/, '').trim()
    const used = projects.filter((p) => p.tags.some((t) => norm(t).replace(/\.js$/, '').includes(key)))
    const jobs = experience.filter((e) => e.tags.some((t) => norm(t).replace(/\.js$/, '').includes(key)))
    const where = [
      jobs.length && `at ${join(jobs.map((j) => `**${j.company}**`))}`,
      used.length && `in projects like ${join(used.slice(0, 3).map((p) => `[${p.name}](/projects/${p.slug})`))}`,
    ].filter(Boolean)
    if (group === 'Soft Skills') {
      return [`Yes, **${item}** is one of Raheem's soft skills, alongside ${join(stack.find((g) => g.group === group).items.filter((i) => i !== item).slice(0, 3).map((i) => i.toLowerCase()))}.${/agile/i.test(item) ? ' He works in an Agile team at Namya IT, with feature development, code reviews and bug fixes.' : ''}`]
    }
    return [
      `Yes, **${item}** is part of Raheem's ${group} toolkit.${/basics/i.test(item) ? ' He has working, foundational knowledge of it.' : ''}${where.length ? ` He has used it ${where.join(' and ')}.` : ''}`,
    ]
  })
}

/** Returns { text, suggestions } for a visitor question. */
export function answer(question) {
  const q = norm(question.trim())

  const project = findProject(q)
  if (project) return reply(projectAnswer(project), SUGGEST.project)

  const job = findJob(q)
  if (job) return reply(jobAnswer(job), SUGGEST.job)

  const soft = stack.find((g) => g.group === 'Soft Skills')
  if (soft && /soft skill|personality|strengths|qualities|kind of person|work ethic/.test(q)) {
    return reply(
      [`Beyond the tech, Raheem's soft skills are:`, list(soft.items.map((i) => `**${i}**`)), `He puts these to work daily in an Agile team at **Namya IT**.`],
      SUGGEST.skills
    )
  }

  const techs = findTechs(q)
  const s = score(q)
  // A named technology plus a "does he know / skills" style question → targeted answer.
  if (techs.length && techs.length <= 3 && s.projects < 2) return reply(techAnswer(techs), SUGGEST.tech)

  const unknown = findUnknownTech(q)
  if (unknown && s.projects < 2) {
    return reply(
      [
        `**${unknown[0].toUpperCase() + unknown.slice(1)}** isn't part of Raheem's listed stack. His core is **JavaScript/TypeScript**: React, Next.js, Node.js, Express, NestJS, MongoDB and PostgreSQL.`,
        `He picks up new tools quickly, though. He moved from vanilla JS to the MERN stack and then into Next.js and NestJS.`,
      ],
      SUGGEST.skills
    )
  }

  if (s.projects > 0) {
    const topical = findProjectsByTopic(q)
    if (topical.length === 1) return reply(projectAnswer(topical[0]), SUGGEST.project)
    if (topical.length > 1 && topical.length < projects.length) {
      return reply(
        [
          `Raheem has ${topical.length} projects that match:`,
          list(topical.map((p) => `[${p.name}](/projects/${p.slug}): ${p.kind}${p.live ? ` · [live ↗](${p.live})` : ''}`)),
          `Ask about any one of them for the full details.`,
        ],
        SUGGEST.project
      )
    }
  }

  // Currently-doing questions are about the job, not "now" in general.
  if (s.current && (s.experience || /\b(doing|working|job|company)\b/.test(q))) return reply(ANSWERS.current(), SUGGEST.current)
  delete s.current

  const ranked = Object.entries(s)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])

  // "about" only wins when nothing more specific was asked.
  const specific = ranked.filter(([k]) => k !== 'about')
  if (specific.length) {
    const [top, second] = specific
    const parts = [...ANSWERS[top[0]]()]
    if (second && second[1] >= 1 && second[1] >= top[1] * 0.75 && !['personal', 'location'].includes(second[0])) {
      parts.push(...ANSWERS[second[0]]())
    }
    return reply(parts, SUGGEST[top[0]])
  }
  if (ranked.length) return reply(ANSWERS.about(), SUGGEST.about)

  if (/^(hi+|hello|hey|hii+|salam|assalam\w*|namaste|good (morning|afternoon|evening)|yo)\b/.test(q)) {
    return reply(
      [
        `Hi there! 👋 I'm Raheem's portfolio assistant.`,
        `Ask me anything about his **education**, **work experience**, **skills**, **projects**, **certifications** or how to **get in touch**.`,
      ],
      SUGGEST.fallback
    )
  }
  if (/\b(thanks?|thank you|thx|great|awesome|cool|nice|perfect)\b/.test(q)) {
    return reply([`You're welcome! Anything else you'd like to know about Raheem?`], SUGGEST.fallback)
  }

  return reply(
    [
      `I'm not sure about that one. I'm Raheem's portfolio assistant, so I can only answer questions about him.`,
      `Try asking about his **education**, **experience**, **skills**, **projects**, **certifications** or **contact details**.`,
    ],
    SUGGEST.fallback
  )
}

const reply = (parts, suggestions) => ({ text: parts.join('\n\n'), suggestions })

export const starters = [
  'Tell me about yourself',
  'What did you study?',
  'Where have you worked?',
  'What are your skills?',
  'Show me your projects',
  'How can I contact you?',
]
