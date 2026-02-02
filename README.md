# Clinic Appointment Booking System

A full-stack web application for managing clinic appointments built with React.js, Node.js, Express, and MongoDB.

## 🚀 Features

### For Patients
- Browse and search for doctors by specialization
- View doctor profiles with ratings and availability
- Book appointments with preferred time slots
- Manage appointments (view, cancel)
- User profile management

### For Doctors
- Manage availability and schedule
- View patient appointments
- Update appointment status
- Add prescription notes

### For Admins
- User management (patients, doctors, admins)
- Appointment oversight
- System monitoring

## 🛠 Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React.js** - UI library
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd "Clinic Appointment Booking System"
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clinic_booking
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

**For MongoDB Atlas**, replace `MONGODB_URI` with your connection string:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/clinic_booking?retryWrites=true&w=majority
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
```
Server runs on **http://localhost:5000**

### Start Frontend
```bash
cd frontend
npm start
```
Application runs on **http://localhost:3000**

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update profile (Protected)

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get single doctor
- `POST /api/doctors` - Create doctor profile (Admin only)
- `PUT /api/doctors/:id` - Update doctor (Doctor/Admin)
- `DELETE /api/doctors/:id` - Delete doctor (Admin only)

### Appointments
- `POST /api/appointments` - Book appointment (Protected)
- `GET /api/appointments` - Get user appointments (Protected)
- `GET /api/appointments/:id` - Get single appointment (Protected)
- `PUT /api/appointments/:id` - Update appointment (Protected)
- `DELETE /api/appointments/:id` - Cancel appointment (Protected)

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 👥 User Roles

1. **Patient** (default) - Can book and manage appointments
2. **Doctor** - Can manage their profile and view appointments
3. **Admin** - Full system access

## 🗂 Project Structure

```
Clinic Appointment Booking System/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   ├── appointmentController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── appointmentRoutes.js
│   │   └── userRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── index.js
│   ├── .env
│   └── package.json
└── README.md
```

## 🔐 Default Admin Account

After setting up, you can create an admin account by registering normally and then manually updating the role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## 🌟 Future Enhancements

- Email/SMS notifications for appointments
- Payment integration
- Medical records management
- Video consultation feature
- Appointment reminders
- Doctor availability calendar
- Patient reviews and ratings
- Multi-language support

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Support

For support or queries, contact: support@cliniccare.com
