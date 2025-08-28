Student Management System - Backend  

A complete Student Management System backend built with Node.js, Express, MySQL, and Prisma ORM featuring JWT authentication and CRUD operations for student management.  
🚀 Features  
  
User Authentication: JWT-based login and registration  
Student Management: Full CRUD operations  
Data Validation: Comprehensive input validation  
Secure: Password hashing with bcrypt  
Database: MySQL with Prisma ORM  
RESTful API: Clean and organized API endpoints  
  
📋 Prerequisites  
Before running this application, make sure you have the following installed:  
  
Node.js (v14 or higher)  
MySQL Server  
npm or yarn  
  
🛠️ Installation & Setup  
1. Clone/Create Project Structure  
student-management-backend/  
├── config/  
│   └── db.js  
├── controllers/  
│   ├── authController.js  
│   └── studentController.js  
├── middleware/  
│   └── auth.js  
├── prisma/  
│   └── schema.prisma  
├── routes/  
│   ├── authRoutes.js  
│   └── studentRoutes.js  
├── .env  
├── package.json  
├── server.js  
└── student_management_db.sql  
2. Install Dependencies  
bashnpm install express cors dotenv bcrypt jsonwebtoken cookie-parser @prisma/client prisma nodemon  
3. Database Setup  
  
Create MySQL Database:  
bash# Login to MySQL  
mysql -u root -p  
  
# Run the SQL file  
source student_management_db.sql  
  
Configure Environment Variables:  

Create .env file in root directory:  
envDATABASE_URL="mysql://username:password@localhost:3306/student_management_db"  

JWT_SECRET="your_super_secret_jwt_key_here_12345"  
PORT=5000  

Replace username and password with your MySQL credentials.  

Generate Prisma Client:  
bashnpx prisma generate  

npx prisma db push  
  
  
4. Start the Server  
bash# Development mode  
npm run dev  
  
 
npm start
The server will start on http://localhost:5000
