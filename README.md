# Who is working? Know your Ministers

A full-stack voting/polling system for Ghanaian citizens to rate cabinet ministers' performance. Built with Next.js 14, TypeScript, Prisma, and Tailwind CSS.

## Features

- **Minister Directory**: View all current ministers with photos, names, and portfolios
- **Voting System**: Cast satisfaction votes (👍 Satisfied / 👎 Not Satisfied) for each minister
- **Daily Vote Limits**: One vote per minister per day (soft-locked by anonymized browser hash)
- **National Satisfaction Meter**: Live 0-100% satisfaction rate with real-time updates
- **Trending Ministers**: Top 3 trending ministers over the last 24 hours
- **Ghanaian IP Detection**: Restrict voting to Ghanaian IP addresses
- **Admin Dashboard**: CRUD operations for ministers, analytics, and data export
- **Social Sharing**: Share minister scores via social media meta tags

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: tRPC for type-safe API routes, Prisma ORM
- **Database**: PostgreSQL (PlanetScale compatible)
- **Authentication**: NextAuth.js (Credentials + GitHub)
- **Real-time**: Ably channels for live updates
- **Validation**: Zod schema validation
- **Testing**: Jest + React Testing Library, Cypress E2E
- **Internationalization**: next-intl (en, ak - future)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd citizen-safistication
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/citizen_safistication"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ABLY_API_KEY="your-ably-api-key"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

### Minister
- `id`: Primary key
- `fullName`: Minister's full name
- `portfolio`: Ministerial portfolio/position
- `photoUrl`: Profile photo URL
- `bio`: Biography (optional)
- `createdAt`: Creation timestamp

### Vote
- `id`: Primary key
- `ministerId`: Foreign key to Minister
- `positive`: Boolean (true = Satisfied)
- `clientHash`: SHA-256 hash of (IP + UA + Date)
- `createdAt`: Vote timestamp

## API Endpoints

### Public Endpoints
- `GET /api/ministers` - List all ministers with stats
- `GET /api/ministers/[id]` - Get minister details
- `GET /api/ministers/trending` - Get trending ministers
- `GET /api/analytics/nationalScore` - Get national satisfaction score
- `POST /api/ministers/[id]/vote` - Submit a vote

### Admin Endpoints (Protected)
- `GET /api/admin/ministers` - Admin minister management
- `POST /api/admin/ministers` - Create minister
- `PUT /api/admin/ministers/[id]` - Update minister
- `DELETE /api/admin/ministers/[id]` - Delete minister
- `GET /api/admin/analytics` - Admin analytics

## Key Functions

### Client Hashing
```typescript
hashClient(ip: string, userAgent: string, salt?: string): string
```
Creates a SHA-256 hash of IP + User Agent + Date for vote deduplication.

### IP Geolocation
```typescript
isGhanaianIP(ip: string): boolean
```
Checks if an IP address is within Ghana's IP ranges.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run Cypress E2E tests
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── minister/[id]/     # Minister detail pages
│   ├── admin/             # Admin dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── NationalMeter.tsx  # Satisfaction meter
│   ├── TrendingGrid.tsx   # Trending ministers
│   ├── MinisterDirectory.tsx
│   └── VoteButtons.tsx
├── lib/                   # Utility functions
│   ├── prisma.ts          # Prisma client
│   ├── trpc.ts            # tRPC setup
│   └── utils.ts           # Helper functions
└── types/                 # TypeScript types
```

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Start production server: `npm run start`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | NextAuth.js base URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes |
| `ABLY_API_KEY` | Ably real-time API key | No |
| `NEXT_PUBLIC_APP_URL` | Public app URL | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## TODO:: Stretch Goals

- [ ] Region-level dashboards (Ashanti, Greater Accra, etc.)
- [ ] Multi-factor identity via GhanaCard API
- [ ] Public GraphQL endpoint for journalists/researchers
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Multi-language support (English, Akan)
- [ ] SMS OTP verification for non-Ghanaian IPs
- [ ] Minister performance history tracking
- [ ] Export functionality (CSV, PDF reports)

## Support

For support, email support@citizen-safistication.gh or create an issue in the repository. 