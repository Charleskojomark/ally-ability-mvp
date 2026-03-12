# The Ally-Ability Network

**Inclusive learning platform for women, persons with disabilities, and teachers in Nigeria.**

Built on a 100% free & open-source stack — zero monthly costs at MVP scale.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router, TypeScript, Tailwind CSS) |
| Backend | Node.js / Express (TypeScript) |
| Database | Supabase (PostgreSQL, Auth, Realtime) |
| Storage | Cloudflare R2 |
| AI Chat | Groq API (LLaMA 3) |
| Video Calls | Jitsi Meet |
| Email | Brevo |
| WhatsApp | Baileys |

## Project Structure

```
ally-ability/
├── apps/
│   ├── web/           # Next.js frontend
│   └── widget/        # Ally-Engine vanilla JS widget
├── packages/
│   ├── api/           # Express backend
│   ├── database/      # Supabase schema & migrations
│   └── shared/        # Shared types & utilities
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
# Fill in the values in .env

# Start all dev servers
pnpm dev

# Or start individually
pnpm dev:web   # Frontend at http://localhost:3000
pnpm dev:api   # Backend at http://localhost:4000
```

## License

MIT
