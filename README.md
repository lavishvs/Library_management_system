# 📚 **Library Management System**  

Welcome to the **Bookworm Library Management System**! This project is a comprehensive solution for managing library operations, including user authentication, book borrowing, and administrative tasks.

---

## 🌟 **Features**

- 🔒 **Authentication**: User registration, login, and role-based access control.
- 📚 **Book Management**: Add, delete, and view books in the library.
- 📖 **Borrowing System**: Borrow and return books with due date tracking.
- 💰 **Fine Calculation**: Automatically calculate fines for overdue books.
- 📧 **Email Notifications**: Send verification codes, password recovery emails, and due date reminders.
- 🛠️ **Admin Features**: Manage users and oversee library operations.

---

## 🛠️ **Tech Stack**

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **File Uploads**: Cloudinary
- **Email Service**: Nodemailer
- **Task Scheduling**: Node-Cron

---

## 🚀 **Getting Started**

### **1. Clone the Repository**
```bash
git clone https://github.com/lavishvs/Library_management_system.git
cd Library_management_system/server

# Install dependencies
npm install

# Start the server
npm run dev
```

### **2. Set Environment Variables**
Create a `.env` file in the root directory and add your environment variables:
---
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
COOKIE_EXPIRES=7
SMTP_HOST=smtp.gmail.com
SMTP_SERVICE=gmail
SMTP_PORT=465
SMTP_MAIL=your_email@gmail.com
SMTP_PASSWORD=your_email_password
CLOUDINARY_CLIENT_NAME=your_cloudinary_name
CLOUDINARY_CLIENT_API=your_cloudinary_api_key
CLOUDINARY_CLIENT_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173

### **3. Run the Server**
Start the server using the command:
```bash
npm run dev
```
### **4.📂 Project Structure**
server/
├── config/              # Configuration files
├── controllers/         # Route handlers
├── database/            # Database connection
├── Middlewares/         # Custom middlewares
├── models/              # Mongoose models
├── routes/              # API routes
├── services/            # Background tasks
├── utils/               # Utility functions
├── app.js               # Express app setup
├── server.js            # Server entry point
└── .gitignore           # Git ignore file


### **📋 API Endpoints**

**Authentication**

- `POST /api/v1/auth/register` - Register a new user.
- `POST /api/v1/auth/login` - Login a user.
- `GET /api/v1/auth/logout` - Logout the user.

**Books**

- `POST /api/v1/book/admin/add` - Add a new book (Admin only).
- `GET /api/v1/book/all` - Get all books.
- `DELETE /api/v1/book/delete/:id` - Delete a book (Admin only).

**Borrowing**

- `POST /api/v1/borrow/record-borrow-book/:id` - Record a borrowed book (Admin only).
- `PUT /api/v1/borrow/return-borrowed-book/:id` - Return a borrowed book (Admin only).
- `GET /api/v1/borrow/all` - Get all borrowed books (Admin only).

**Users**

- `GET /api/v1/user/all` - Get all users (Admin only).
- `DELETE /api/v1/user/delete/:id` - Delete a user (Admin only).

### **🔐 Authentication**

- Users can register and login to access the API.
- JWT tokens are used for authentication and authorization.

### **📚 Books**

- Admins can add, delete, and retrieve books.
- Users can view all available books.

### **📖 Borrowing**
- Admins can record and return borrowed books.
- Users can view their borrowed books.

### **👥 Users**

- Admins can view and delete users.
- Users can view their profile and update their information.

### **🔔 Notifications**

- Admins can send notifications to users when a book is borrowed or returned.
- Users can receive notifications via email or in-app notifications.


### **🔒 Security**

- The API uses HTTPS to ensure secure communication.
- Passwords are hashed and salted for security.

### **🔧 Development**

- The API is built using Node.js and Express.
- The database is MongoDB.
- The API is deployed on Heroku.

### **📝 Documentation**

### **🔐 Authentication**

- Users can register and login to access the API.
- JWT tokens are used for authentication and authorization.

### **📚 Books**

- Admins can add, delete, and retrieve books.
- Users can view all available books.

### **📖 Borrowing**

**Users**

- `GET /api/v1/user/all` - Get all users (Admin only).
- `DELETE /api/v1/user/delete/:id` - Delete a user (Admin only).

### **🔐 Authentication**

- Users can register and login to access the API.
- JWT tokens are used for authentication and authorization.

### **📚 Books**

- Admins can add, delete, and retrieve books.
- Users can view all available books.

### **📖 Borrowing**
### **🛡️ Security Features**

Passwords are hashed using bcrypt.
Authentication is handled using JWT.
Role-based access control ensures only authorized users can perform specific actions.

### **🛠️ Planned Improvements**

📊 Dashboard: Add an admin dashboard for better insights.
📱 Mobile Support: Create a mobile-friendly frontend.
🔔 Notifications: Add SMS notifications for overdue books.

### **🤝 Contributing**
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a new branch (git checkout -b feature-name).
Commit your changes (git commit -m "Add feature").
Push to the branch (git push origin feature-name).
Open a pull request.

### **📧 Contact**
For any queries or suggestions, feel free to reach out:

Author: Lavish V.S.
GitHub: [lavishvs](https://github.com/lavishvs)
📜 License
This project is licensed under the MIT License. See the LICENSE file for details.
