export type IntakeOption = { e: string; t: string; v: "a" | "b" | "c" | "d" };
export type IntakeQuestion = { id: string; emoji: string; q: string; sub: string; opts: IntakeOption[] };

export const QUESTIONS: IntakeQuestion[] = [
  { id: "q1", emoji: "👓", q: "How do you typically wear your glasses?", sub: "Choose the option that fits best", opts: [
    { e: "☀️", t: "Every day, all day — they're part of me", v: "a" },
    { e: "💻", t: "Mostly for reading or screens", v: "b" },
    { e: "🔄", t: "I switch between glasses and contacts", v: "c" },
    { e: "🚗", t: "Mainly for driving or specific tasks", v: "d" },
  ]},
  { id: "q2", emoji: "✨", q: "What word best describes your personal style?", sub: "Go with your gut — no wrong answer", opts: [
    { e: "🎩", t: "Classic & Polished", v: "a" },
    { e: "🔷", t: "Modern & Bold", v: "b" },
    { e: "🌿", t: "Relaxed & Practical", v: "c" },
    { e: "🎨", t: "Creative & Unique", v: "d" },
  ]},
  { id: "q3", emoji: "🖥️", q: "On a typical weekday, how many hours are you on screens?", sub: "Phone, computer, TV — all count!", opts: [
    { e: "😎", t: "Less than 2 hours", v: "a" },
    { e: "📱", t: "About 2–4 hours", v: "b" },
    { e: "💻", t: "About 4–8 hours", v: "c" },
    { e: "🔥", t: "More than 8 hours", v: "d" },
  ]},
  { id: "q4", emoji: "🛍️", q: "When buying something you use every day, you tend to:", sub: "Think about how you usually decide", opts: [
    { e: "💎", t: "Invest in quality — you get what you pay for", v: "a" },
    { e: "⚖️", t: "Find the sweet spot between quality and value", v: "b" },
    { e: "🔍", t: "Look for the best deal possible", v: "c" },
    { e: "🤝", t: "Ask someone I trust for a recommendation", v: "d" },
  ]},
  { id: "q5", emoji: "🚗", q: "If your glasses were a vehicle, they'd be:", sub: "First instinct is usually the best!", opts: [
    { e: "🚙", t: "A reliable SUV — practical, does it all", v: "a" },
    { e: "🏎️", t: "A sports car — turns heads effortlessly", v: "b" },
    { e: "🚘", t: "A classic car — timeless & full of character", v: "c" },
    { e: "🚜", t: "A rugged 4×4 — built to handle anything", v: "d" },
  ]},
  { id: "q6", emoji: "⏰", q: "How long ago did you get your current glasses?", sub: "Be honest — no judgment here!", opts: [
    { e: "✨", t: "Less than a year ago", v: "a" },
    { e: "📅", t: "About 1–2 years ago", v: "b" },
    { e: "⏳", t: "About 2–3 years ago", v: "c" },
    { e: "😬", t: "More than 3 years ago!", v: "d" },
  ]},
  { id: "q7", emoji: "🌟", q: "In your perfect glasses, you'd feel:", sub: "What matters most to you", opts: [
    { e: "💼", t: "Confident and put-together", v: "a" },
    { e: "😌", t: "Comfortable and at ease", v: "b" },
    { e: "🏃", t: "Active and ready for anything", v: "c" },
    { e: "🌟", t: "Expressive and noticed", v: "d" },
  ]},
  { id: "q8", emoji: "💳", q: "If you treated yourself to something today, you'd spend:", sub: "For something you'd wear every single day", opts: [
    { e: "💚", t: "Up to $100", v: "a" },
    { e: "💛", t: "$100 – $250", v: "b" },
    { e: "🧡", t: "$250 – $500", v: "c" },
    { e: "❤️", t: "Whatever it takes to get it right", v: "d" },
  ]},
  { id: "q9", emoji: "🔵", q: "Which best describes the shape of your face?", sub: "This helps us suggest the most flattering frames", opts: [
    { e: "⭕", t: "Round — soft, full features", v: "a" },
    { e: "🥚", t: "Oval — balanced & proportional", v: "b" },
    { e: "◼️", t: "Square — strong, defined jawline", v: "c" },
    { e: "🔺", t: "Heart / Diamond — wider at top", v: "d" },
  ]},
  { id: "q10", emoji: "🎨", q: "Which colors do you tend to gravitate toward?", sub: "Think about your wardrobe & accessories", opts: [
    { e: "🖤", t: "Classic blacks & dark tones", v: "a" },
    { e: "🍂", t: "Warm browns & tortoiseshell", v: "b" },
    { e: "✨", t: "Metallics — silver, gold, rose gold", v: "c" },
    { e: "🌈", t: "Bold & bright — I like to stand out!", v: "d" },
  ]},
  { id: "q11", emoji: "🪞", q: "How do you feel about your current frame style?", sub: "Honest answer = better recommendations!", opts: [
    { e: "💕", t: "Love it — want something very similar", v: "a" },
    { e: "🔄", t: "Ready for something completely different", v: "b" },
    { e: "✨", t: "Similar, but with a few upgrades", v: "c" },
    { e: "🤷", t: "Open to whatever looks best on me", v: "d" },
  ]},
  { id: "q12", emoji: "📍", q: "Where do you wear your glasses most?", sub: "Choose your primary environment", opts: [
    { e: "💼", t: "Office / indoors — lots of screen time", v: "a" },
    { e: "🌿", t: "Outdoors & active lifestyle", v: "b" },
    { e: "🔄", t: "Everywhere — need them for everything", v: "c" },
    { e: "🎭", t: "Mainly formal / professional settings", v: "d" },
  ]},
];
