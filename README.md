# RepurposeAI 🚀

An AI-powered content repurposing platform that transforms a single YouTube video, audio file, or blog post into high-quality, platform-optimized content for multiple social media channels — instantly.

![RepurposeAI Dashboard](https://via.placeholder.com/1200x630/6366f1/ffffff?text=RepurposeAI)

🌐 **Live Demo:** [repurpose-ai-c5ks.onrender.com](https://repurpose-ai-c5ks.onrender.com)

## ✨ Features

- **3 Input Types** — YouTube URLs, audio file uploads (MP3/WAV/M4A), or blog/article URLs
- **5 Platform Outputs** — Twitter threads, LinkedIn posts, Instagram captions, SEO blog articles, and email newsletters
- **Tone Customization** — Professional, Casual, Storytelling, or Gen-Z writing styles
- **AI-Powered Generation** — Google Gemini 2.5 Flash with automatic retry/backoff for reliability
- **Audio Transcription** — AssemblyAI integration for high-accuracy audio-to-text
- **YouTube Transcript Extraction** — Free caption extraction, no API key required
- **Blog Scraping** — Intelligent content extraction from any article URL
- **Content History** — All past generations saved and viewable anytime
- **Authentication** — Secure email/password auth with NextAuth.js and JWT sessions
- **Copy to Clipboard** — One-click copy for every generated output

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| Backend | Next.js API Routes (Route Handlers) |
| Database | MongoDB Atlas + Mongoose |
| Auth | NextAuth.js v4 (Credentials + JWT) |
| AI Generation | Google Gemini 2.5 Flash (`@google/genai`) |
| Audio Transcription | AssemblyAI SDK |
| YouTube Extraction | `youtube-transcript` |
| Blog Scraping | Cheerio + Axios |
| Deployment | Vercel |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- Google Gemini API key ([get one free](https://aistudio.google.com/apikey))
- AssemblyAI API key ([get one free](https://www.assemblyai.com/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/meghaasinghh/repurpose-ai.git
cd repurpose-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000
```

4. **Generate a NextAuth secret**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

src/
├── app/
│ ├── api/
│ │ ├── auth/ # NextAuth + signup routes
│ │ ├── extract/ # YouTube, blog, audio extraction
│ │ ├── generate/ # Gemini AI generation pipeline
│ │ └── history/ # Content history endpoint
│ ├── dashboard/ # Main app dashboard
│ ├── history/ # Content history page
│ ├── login/ # Login page
│ └── signup/ # Signup page
├── lib/
│ ├── models/ # Mongoose models (User, Content)
│ ├── gemini.ts # Gemini client + retry logic
│ ├── mongodb.ts # MongoDB connection utility
│ └── prompts.ts # Platform-specific prompt builders
└── types/ # TypeScript type extensions

## 🗺️ Roadmap

### ✅ Phase 1 — Core Platform (Complete)
- [x] User authentication (signup, login, sessions)
- [x] YouTube transcript extraction
- [x] Audio file transcription (AssemblyAI)
- [x] Blog URL scraping and content extraction
- [x] AI content generation for 5 platforms
- [x] Tone customization (4 styles)
- [x] Content history with saved outputs
- [x] Copy-to-clipboard for all outputs

### 🔜 Phase 2 — Growth Features
- [ ] Social media scheduling (Twitter/LinkedIn API integrations)
- [ ] Performance prediction scoring for generated content
- [ ] Bulk processing (multiple inputs at once)
- [ ] Video clip/highlight detection and Reels/Shorts suggestions
- [ ] Content calendar view (multi-day post planning)
- [ ] Freemium billing tiers (Stripe integration)
- [ ] Background job queue (Redis/BullMQ) for long-running tasks
- [ ] API access for businesses
- [ ] UI redesign and polish pass

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `ASSEMBLYAI_API_KEY` | AssemblyAI API key for audio transcription |
| `NEXTAUTH_SECRET` | Random secret for JWT encryption |
| `NEXTAUTH_URL` | Base URL of the app (use `http://localhost:3000` for dev) |

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.