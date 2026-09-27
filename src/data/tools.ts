export interface Tool {
  name: string;
  href: string;
  description: string;
  category: string;
}

export const tools: Tool[] = [
  {
    name: "Typinks Poster Generator",
    href: "/typinks-poster-generator",
    description: "Social media posters for observance days, with custom text, dates and Unsplash backgrounds.",
    category: "Design",
  },
  {
    name: "Kroenger Poster Generator",
    href: "/kroenger-poster-generator",
    description: "Environmental awareness posters with custom backgrounds and text styling.",
    category: "Design",
  },
  {
    name: "SSE Tester",
    href: "/sse",
    description: "Connect to a server-sent events endpoint and watch messages arrive in real time.",
    category: "Developer",
  },
  {
    name: "Redis Lua Script Tester",
    href: "/redis-lua",
    description: "Write and run Lua scripts against Redis in a Monaco editor.",
    category: "Developer",
  },
  {
    name: "JSON Formatter & Validator",
    href: "/json-formatter",
    description: "Validate JSON as you type, see errors by line and column, then format or minify it.",
    category: "Developer",
  },
  {
    name: "Base64 & URL Encoder",
    href: "/base64-url-encoder",
    description: "Encode and decode Base64, Base64URL and URL text, or turn a file into a Base64 data URL.",
    category: "Developer",
  },
  {
    name: "JWT Decoder",
    href: "/jwt-decoder",
    description: "Read a JSON Web Token's header, payload and expiry, and verify HS, RS, PS or ES signatures.",
    category: "Developer",
  },
  {
    name: "Regex Tester",
    href: "/regex-tester",
    description: "Test JavaScript regular expressions with live highlighting, capture groups and a replace preview.",
    category: "Developer",
  },
  {
    name: "Cron Expression Explainer",
    href: "/cron-explainer",
    description: "See what a cron expression means in plain English and when it will run next.",
    category: "Developer",
  },
  {
    name: "UUID & Hash Generator",
    href: "/uuid-hash-generator",
    description: "Generate UUID v4 or v7 in bulk, inspect any UUID, and hash text or files with MD5 and SHA.",
    category: "Developer",
  },
  {
    name: "Text Editor",
    href: "/text-editor",
    description: "A lightweight editor with word, character and line counts that saves as you type.",
    category: "Productivity",
  },
  {
    name: "Pomodoro Planner",
    href: "/planner",
    description: "A 25/5 focus timer with a To-Do, Doing, Done task board.",
    category: "Productivity",
  },
  {
    name: "Prelims Marks Calculator",
    href: "/prelims-marks-calculator",
    description: "Score competitive exams with 1/2, 1/3, 1/4 or 2/3 negative marking.",
    category: "Calculators",
  },
  {
    name: "Life Time Calculator",
    href: "/life-time-calculator",
    description: "See how long you have lived, down to the second, and share it.",
    category: "Calculators",
  },
  {
    name: "Sudoku",
    href: "/sudoku",
    description: "Unlimited free 9x9 Sudoku puzzles with validation.",
    category: "Games",
  },
  {
    name: "Slide Puzzle",
    href: "/slide-puzzle",
    description: "A 3x3 sliding puzzle you can play with your own photos.",
    category: "Games",
  },
  {
    name: "Chat Room",
    href: "/chat",
    description: "A public chat room. No signup needed.",
    category: "Community",
  },
  {
    name: "Image Chat Room",
    href: "/image-chat",
    description: "Share images with everyone in a public room.",
    category: "Community",
  },
];
