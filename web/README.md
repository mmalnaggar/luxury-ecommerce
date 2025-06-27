# Luxury E-commerce Platform

A modern, feature-rich luxury e-commerce platform built with Next.js 15, TypeScript, Prisma, and NextAuth.

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- PostgreSQL database
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Option 1: GitHub Actions (Recommended)

1. **Push your code to GitHub**
2. **Set up GitHub Secrets** (see [DEPLOYMENT.md](./DEPLOYMENT.md))
3. **The workflow will automatically deploy on push to main**

### Option 2: Manual Deployment

1. **Run the deployment script**:
   ```bash
   ./scripts/deploy.sh
   ```

2. **Or deploy manually**:
   ```bash
   npm run build
   vercel --prod
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🏗️ Project Structure

```
web/
├── app/                    # Next.js 15 app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin panel
│   └── luxury/            # Main luxury page
├── components/            # Reusable components
├── lib/                   # Utility functions
├── prisma/                # Database schema and migrations
├── public/                # Static assets
└── scripts/               # Deployment and utility scripts
```

## 🛠️ Features

### Core Features
- ✅ **User Authentication** - NextAuth with Google OAuth
- ✅ **Product Management** - CRUD operations for products
- ✅ **Shopping Cart** - Add, remove, update items
- ✅ **Order Management** - Complete order lifecycle
- ✅ **User Dashboard** - Personal order history and profile
- ✅ **Admin Panel** - Product and order management
- ✅ **Responsive Design** - Mobile-first approach

### Advanced Features
- ✅ **AR Integration** - 3D model upload and viewing
- ✅ **Search & Filters** - Advanced product search
- ✅ **Wishlist** - Save favorite products
- ✅ **Reviews & Ratings** - Product reviews system
- ✅ **Analytics Dashboard** - Sales and performance metrics
- ✅ **Email Notifications** - Order confirmations and updates
- ✅ **Payment Integration** - Stripe and Paymob (disabled for deployment)

### Technical Features
- ✅ **TypeScript** - Full type safety
- ✅ **Prisma ORM** - Type-safe database operations
- ✅ **NextAuth** - Secure authentication
- ✅ **Tailwind CSS** - Modern styling
- ✅ **Jest Testing** - Comprehensive test suite
- ✅ **ESLint** - Code quality and consistency
- ✅ **Performance Monitoring** - Built-in performance tracking

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities:

- **Users** - Customer and admin accounts
- **Products** - Product catalog with variants
- **Orders** - Order management and tracking
- **Cart** - Shopping cart functionality
- **Reviews** - Product reviews and ratings
- **Wishlist** - User wishlists
- **AR Assets** - 3D models and AR content
- **Brands** - Brand management

## 🔧 Configuration

### Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth secret key
- `NEXTAUTH_URL` - Application URL

Optional:
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `STRIPE_SECRET_KEY` - Stripe payment integration
- `PAYMOB_API_KEY` - Paymob payment integration
- `SMTP_*` - Email configuration

### Database Setup

1. **Create a PostgreSQL database**
2. **Update DATABASE_URL in .env.local**
3. **Run migrations**:
   ```bash
   npx prisma db push
   ```

## 🚀 Performance

- **Next.js 15** - Latest features and optimizations
- **Image Optimization** - Automatic image optimization
- **Code Splitting** - Automatic code splitting
- **Static Generation** - Pre-rendered pages where possible
- **Performance Monitoring** - Built-in performance tracking

## 🔒 Security

- **NextAuth** - Secure authentication
- **CSRF Protection** - Built-in CSRF protection
- **Input Validation** - Comprehensive input validation
- **SQL Injection Protection** - Prisma ORM protection
- **Environment Variables** - Secure configuration management

## 📱 Mobile Support

- **Responsive Design** - Mobile-first approach
- **Touch-Friendly** - Optimized for touch devices
- **Progressive Web App** - PWA capabilities
- **Offline Support** - Service worker for offline functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
2. Review the [troubleshooting section](./DEPLOYMENT.md#troubleshooting)
3. Check the GitHub Issues for known problems
4. Create a new issue for bugs or feature requests

## 🎉 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Prisma team for the excellent ORM
- NextAuth team for authentication
- Tailwind CSS for styling
