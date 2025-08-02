# Waste Management System

A comprehensive waste management platform that includes user management, marketplace, and educational content services.

## 🌟 Features

- **User Management**
  - User registration and authentication
  - Profile management
  - Secure password handling

- **Marketplace**
  - Browse and search for waste management products
  - Shopping cart functionality
  - Product listings with details

- **Educational Content**
  - Informative articles and guides
  - Waste management best practices
  - Recycling and disposal guidelines

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)

## 📂 Project Structure

```
.
├── client/                 # Frontend React application
├── services/
│   ├── user-service/       # User management microservice
│   ├── marketplace-service/# Marketplace functionality
│   └── educational-content-service/  # Educational resources
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:faraz66/WasteManagement.git
   cd WasteManagement
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..

   # Install service dependencies
   cd services/user-service
   npm install
   cd ../marketplace-service
   npm install
   cd ../educational-content-service
   npm install
   cd ../..
   ```

3. **Set up environment variables**
   - Create `.env` files in the root and service directories as per the `.env.example` files
   - Configure your database connection strings and JWT secrets

4. **Database Setup**
   - Create a new PostgreSQL database
   - Run the SQL scripts in each service's directory to set up the required tables

5. **Start the application**
   ```bash
   # Start all services
   ./start-services.sh

   # Or start services individually
   # User Service
   cd services/user-service
   npm start

   # Marketplace Service
   cd ../marketplace-service
   npm start

   # Educational Content Service
   cd ../educational-content-service
   npm start

   # Frontend
   cd ../../client
   npm start
   ```

## 🌐 API Documentation

API documentation is available at `/api-docs` when running the respective services.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- All contributors who have helped in developing this project
- Open source libraries and frameworks used in this project
