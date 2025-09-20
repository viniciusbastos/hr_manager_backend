# # HR Manager Backend

A robust backend system for managing military personnel, weapons inventory, and administrative tasks.

## Features

- **User Management**

  - Authentication with JWT
  - Role-based access control (ADMIN, USER)
  - Profile management
  - Unit assignments

- **Weapon Management**

  - Inventory tracking
  - Assignment/discharge workflow
  - Status monitoring
  - PDF document generation
  - WhatsApp notifications

- **Personnel Administration**
  - Vacation planning
  - Unit transfers
  - Service history tracking
  - Automated notifications

## Tech Stack

- Node.js & Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- WhatsApp API Integration

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn
- Docker (optional)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/hr_manager_backend.git
cd hr_manager_backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/hr_manager"
JWT_SECRET="your-secret-key"
WHATSAPP_API_KEY="your-whatsapp-api-key"
```

5. Run database migrations:

```bash
npx prisma migrate dev
```

6. Start the development server:

```bash
npm run dev
```

## API Documentation

The API documentation is available at `/api-docs` when running the server.

### Key Endpoints

- `/api/auth` - Authentication routes
- `/api/users` - User management
- `/api/weapons` - Weapon inventory
- `/api/vacations` - Vacation planning

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## Docker Deployment

Build the container:

```bash
docker build -t hr-manager-backend .
```

Run with Docker:

```bash
docker run -p 3000:3000 hr-manager-backend
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@yourcompany.com or join our Slack channel.
