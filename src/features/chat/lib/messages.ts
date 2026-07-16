export interface ChatMessage {
  id: string;
  fromMe: boolean;
  body: string;
  sentAtIso: string;
}

export function mockThread(bookingId: string): ChatMessage[] {
  const base = new Date();
  base.setHours(9, 0, 0, 0);
  const at = (minsFromBase: number) => {
    const d = new Date(base);
    d.setMinutes(d.getMinutes() + minsFromBase);
    return d.toISOString();
  };

  return [
    {
      id: `${bookingId}-1`,
      fromMe: false,
      body: "Hi, looking forward to our session. What are you training for right now?",
      sentAtIso: at(0),
    },
    {
      id: `${bookingId}-2`,
      fromMe: true,
      body: "Mostly strength. Coming back after a shoulder niggle.",
      sentAtIso: at(4),
    },
    {
      id: `${bookingId}-3`,
      fromMe: false,
      body: "Got it. We will keep the first session light and assess. You can reach me on 9876543210 if anything changes.",
      sentAtIso: at(9),
    },
    {
      id: `${bookingId}-4`,
      fromMe: true,
      body: "Sounds good, see you at the gym.",
      sentAtIso: at(12),
    },
  ];
}
