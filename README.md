# Photocopier Management System

A comprehensive CRM system for managing photocopier dealership operations, built with Vue 3 and Node.js.

## Features

- Customer Management
- Machine Inventory
- Service Ticket Tracking
- Maintenance Scheduling
- Inventory Management
- Reporting and Analytics
- Multi-branch Support
- User Management

## Tech Stack

- Frontend: Vue 3 + Vite
- Backend: Node.js + Express
- Database: MongoDB
- State Management: Pinia
- UI Framework: Tailwind CSS

## Project Structure

```
photocopier-management-system/
├── frontend/                 # Vue 3 frontend application
│   └── photocopier-cms-frontend/
│       ├── src/
│       │   ├── components/   # Reusable components
│       │   ├── views/        # Page components
│       │   ├── stores/       # Pinia stores
│       │   ├── services/     # API services
│       │   └── utils/        # Utility functions
│       └── ...
└── backend/                  # Node.js backend application
    ├── src/
    │   ├── controllers/      # Route controllers
    │   ├── models/          # Database models
    │   ├── routes/          # API routes
    │   └── services/        # Business logic
    └── ...
```

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/photocopier-cms-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in both frontend and backend directories with the following variables:

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
```

### Backend (.env)
```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 