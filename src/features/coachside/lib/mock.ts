
export type CertStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface CoachClient {
  id: string;
  name: string;
  gym: string;
  goal: string;
  sessionsCompleted: number;
  lastSessionIso: string | null;
  nextSessionIso: string | null;
}

export interface CoachSession {
  id: string;
  clientId: string | null;
  clientName: string | null;
  gym: string | null;
  startIso: string;
  status: "FREE" | "BOOKED" | "COMPLETED";
  grossPaise: number;
}

export interface CoachThread {
  bookingId: string;
  peerName: string;
  lastMessage: string;
  unread: boolean;
}

export interface CoachReview {
  id: string;
  author: string;
  rating: number;
  text: string;
  reply: string | null;
}

export interface CoachCertification {
  id: string;
  title: string;
  issuer: string;
  status: CertStatus;
}

export interface CoachChatMessage {
  id: string;
  fromMe: boolean;
  text: string;
  timeIso: string;
}

function iso(dayOffset: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const MOCK_CLIENTS: CoachClient[] = [
  {
    id: "c1",
    name: "Ravi Menon",
    gym: "Iron Vault, Indiranagar",
    goal: "Strength",
    sessionsCompleted: 14,
    lastSessionIso: iso(-2, 7),
    nextSessionIso: iso(0, 7),
  },
  {
    id: "c2",
    name: "Meera Nair",
    gym: "Pulse Fitness, Koramangala",
    goal: "Fat loss",
    sessionsCompleted: 6,
    lastSessionIso: iso(-4, 18),
    nextSessionIso: iso(0, 18),
  },
  {
    id: "c3",
    name: "Arjun Rao",
    gym: "Iron Vault, Indiranagar",
    goal: "Endurance",
    sessionsCompleted: 21,
    lastSessionIso: iso(-1, 6, 30),
    nextSessionIso: iso(1, 6, 30),
  },
  {
    id: "c4",
    name: "Sana Kapoor",
    gym: "Pulse Fitness, Koramangala",
    goal: "Returning after injury",
    sessionsCompleted: 3,
    lastSessionIso: iso(-7, 8),
    nextSessionIso: null,
  },
];

export const MOCK_SESSIONS: CoachSession[] = [
  {
    id: "s1",
    clientId: "c1",
    clientName: "Ravi Menon",
    gym: "Iron Vault, Indiranagar",
    startIso: iso(0, 7),
    status: "BOOKED",
    grossPaise: 129900,
  },
  {
    id: "s2",
    clientId: null,
    clientName: null,
    gym: null,
    startIso: iso(0, 12),
    status: "FREE",
    grossPaise: 129900,
  },
  {
    id: "s3",
    clientId: "c2",
    clientName: "Meera Nair",
    gym: "Pulse Fitness, Koramangala",
    startIso: iso(0, 18),
    status: "BOOKED",
    grossPaise: 129900,
  },
  {
    id: "s4",
    clientId: "c3",
    clientName: "Arjun Rao",
    gym: "Iron Vault, Indiranagar",
    startIso: iso(1, 6, 30),
    status: "BOOKED",
    grossPaise: 129900,
  },
  {
    id: "s5",
    clientId: null,
    clientName: null,
    gym: null,
    startIso: iso(1, 17),
    status: "FREE",
    grossPaise: 129900,
  },
];

export const MOCK_COMPLETED: CoachSession[] = [
  {
    id: "e1",
    clientId: "c1",
    clientName: "Ravi Menon",
    gym: "Iron Vault, Indiranagar",
    startIso: iso(-1, 7),
    status: "COMPLETED",
    grossPaise: 129900,
  },
  {
    id: "e2",
    clientId: "c3",
    clientName: "Arjun Rao",
    gym: "Iron Vault, Indiranagar",
    startIso: iso(-2, 6, 30),
    status: "COMPLETED",
    grossPaise: 129900,
  },
  {
    id: "e3",
    clientId: "c2",
    clientName: "Meera Nair",
    gym: "Pulse Fitness, Koramangala",
    startIso: iso(-3, 18),
    status: "COMPLETED",
    grossPaise: 129900,
  },
  {
    id: "e4",
    clientId: "c4",
    clientName: "Sana Kapoor",
    gym: "Pulse Fitness, Koramangala",
    startIso: iso(-5, 8),
    status: "COMPLETED",
    grossPaise: 99900,
  },
];

export const MOCK_THREADS: CoachThread[] = [
  {
    bookingId: "b1",
    peerName: "Ravi Menon",
    lastMessage: "See you at 7. Bringing the knee sleeve.",
    unread: true,
  },
  {
    bookingId: "b2",
    peerName: "Meera Nair",
    lastMessage: "Can we push to 6:30 on Thursday?",
    unread: false,
  },
  {
    bookingId: "b3",
    peerName: "Arjun Rao",
    lastMessage: "Thanks for the plan. Legs are sore.",
    unread: false,
  },
];

export const MOCK_REVIEWS: CoachReview[] = [
  {
    id: "r1",
    author: "Ravi Menon",
    rating: 5,
    text: "Clear plan, held me to it. Real progress in six weeks.",
    reply: null,
  },
  {
    id: "r2",
    author: "Meera Nair",
    rating: 5,
    text: "Patient with a returning knee injury. Adjusted every session.",
    reply: "Thanks Meera. Steady work on your side made it easy.",
  },
  {
    id: "r3",
    author: "Arjun Rao",
    rating: 4,
    text: "Good sessions. Would like more mobility work next block.",
    reply: null,
  },
];

export const MOCK_CERTS: CoachCertification[] = [
  { id: "cert1", title: "Certified Personal Trainer", issuer: "K11 Academy", status: "VERIFIED" },
  { id: "cert2", title: "Strength and Conditioning", issuer: "NSCA", status: "PENDING" },
  { id: "cert3", title: "Sports Nutrition", issuer: "ISSA", status: "REJECTED" },
];

export const MOCK_SPECIALTIES = [
  "Strength",
  "Fat loss",
  "Mobility",
  "Endurance",
  "Post-injury",
  "Powerlifting",
];

export function threadSeed(peerName: string): CoachChatMessage[] {
  return [
    { id: "m1", fromMe: false, text: `Hi, this is ${peerName}. Looking forward to the session.`, timeIso: iso(0, 9) },
    { id: "m2", fromMe: true, text: "Good to have you. Reach me on 98765 43210 if the gym is locked.", timeIso: iso(0, 9, 2) },
    { id: "m3", fromMe: false, text: "Got it. My email is member@example.com for the plan.", timeIso: iso(0, 9, 5) },
  ];
}

export function maskPii(text: string): string {
  return text
    .replace(/\b(?:\+?\d[\d\s-]{7,}\d)\b/g, "[hidden]")
    .replace(/\b[\w.+-]+@[\w-]+\.[\w.-]+\b/g, "[hidden]");
}
