# Citizen Satisfaction Meter

A modern web application that allows Ghanaian citizens to rate the performance of cabinet ministers and view live satisfaction metrics. Built with Next.js, TypeScript, and Prisma.

## 🚀 Features

### For Citizens
- **National Satisfaction Meter**: View overall satisfaction with the government
- **Minister Directory**: Browse all ministers with search and filter functionality
- **Trending Ministers**: See which ministers are currently trending
- **Voting System**: Rate ministers as satisfied or not satisfied (one vote per day per minister)
- **Real-time Updates**: Live notifications when votes are cast
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### For Administrators
- **Admin Dashboard**: Comprehensive overview of system statistics
- **Minister Management**: View, edit, and manage minister profiles
- **Analytics Dashboard**: Detailed charts and insights into voting patterns
- **Daily Reports**: Track voting activity and satisfaction trends
- **Data Export**: Export voting data for analysis

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: SQLite with Prisma ORM
- **Charts**: Recharts
- **Icons**: Lucide React
- **Real-time**: Ably (planned integration)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd citizen-satisfaction-meter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your database URL:
   ```
   DATABASE_URL="file:./dev.db"
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Ministers
- `id`: Unique identifier
- `fullName`: Minister's full name
- `portfolio`: Ministerial portfolio/position
- `photoUrl`: Profile photo URL
- `bio`: Minister biography
- `isTrending`: Whether the minister is currently trending
- `createdAt`: Record creation timestamp

### Votes
- `id`: Unique identifier
- `ministerId`: Reference to minister
- `positive`: Boolean indicating satisfaction (true = satisfied)
- `clientHash`: SHA-256 hash of client info for vote tracking
- `createdAt`: Vote timestamp

## 🚀 API Endpoints

### Public Endpoints
- `GET /api/ministers` - Get all ministers with stats
- `GET /api/ministers/[id]` - Get specific minister details
- `GET /api/ministers/trending` - Get trending ministers
- `POST /api/ministers/[id]/vote` - Submit a vote
- `GET /api/analytics/nationalScore` - Get national satisfaction score

### Admin Endpoints
- `GET /api/analytics/daily` - Get daily voting analytics
- `GET /admin/ministers` - Admin minister management
- `GET /admin/analytics` - Admin analytics dashboard

## 🎨 Components

### Core Components
- `NationalMeter`: Displays national satisfaction percentage
- `TrendingGrid`: Shows trending ministers
- `MinisterDirectory`: Complete minister listing with search
- `VoteButtons`: Voting interface for individual ministers
- `VoteNotification`: Real-time vote notifications
- `Navigation`: Main navigation component

### Admin Components
- `AdminMinistersPage`: Minister management interface
- `AdminAnalyticsPage`: Analytics dashboard with charts

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run test:e2e` - Run Cypress E2E tests
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

### Project Structure
```
src/
├── app/                 # Next.js app directory
│   ├── admin/          # Admin pages
│   ├── api/            # API routes
│   ├── minister/       # Minister detail pages
│   └── globals.css     # Global styles
├── components/         # React components
├── lib/               # Utility functions
└── prisma/            # Database schema and migrations
```

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Test Coverage
The application includes comprehensive tests for:
- Component rendering and interactions
- API endpoint functionality
- Database operations
- User voting flows

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security Features

- **Vote Rate Limiting**: One vote per day per minister per user
- **Client Hashing**: SHA-256 hashing of client info for vote tracking
- **Input Validation**: Comprehensive validation on all inputs
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **XSS Protection**: React's built-in XSS protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Ghanaian citizens for inspiration
- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first styling
- Framer Motion for smooth animations

## 📞 Support

For support, email support@citizensatisfactionmeter.com or create an issue in this repository.

---

**Built with ❤️ for Ghanaian democracy and transparency** 