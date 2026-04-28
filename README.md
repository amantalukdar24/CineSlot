# CineSlot 🎬

CineSlot is a modern, full-stack movie ticket booking platform built with a microservices architecture. It features separate portals for end-users to book tickets and for administrators to manage movies, showtimes, and view collections.

## 🔗 Live Links
- **User Portal**: [https://cineslot-userend.onrender.com/](https://cineslot-userend.onrender.com/)
- **Admin Portal**: [https://cineslot-adminend.onrender.com/](https://cineslot-adminend.onrender.com/)

## 🚀 Features

### User End (Customer Portal)
- **Movie Browsing**: View currently ongoing and upcoming movies.
- **Showtime Selection**: Choose specific dates and timings for movies.
- **Dynamic Seat Selection**: Interactive UI for selecting available seats across different categories (Regular, Premium, VIP) with distinct pricing.
- **Secure Payments**: Integrated with Razorpay for seamless and secure ticket purchasing.
- **Booking History**: Users can view their booked tickets and payment history.
- **Authentication**: Secure JWT-based authentication for user login/signup.

### Admin End (Management Portal)
- **Movie Management**: Add, edit, or delete movies. Upload movie cover images (integrated with Cloudinary).
- **Showtime Scheduling**: Assign available show dates and times for each movie.
- **Dashboard & Analytics**: View total revenue, ticket sales, and detailed booking information per show.

### Backend Architecture
- **Microservices**: Scalable backend divided into independent services (`AuthService`, `MovieService`, `PaymentService`).
- **Asynchronous Communication**: RabbitMQ is used for reliable inter-service message brokering.
- **Caching**: Redis implementation for faster data retrieval.

---

## 🛠️ Tech Stack

**Frontend**
- Next.js (React)
- TypeScript
- Tailwind CSS
- Framer Motion (for animations)
- React Hot Toast (for notifications)

**Backend (Microservices)**
- Node.js & Express.js
- TypeScript
- MongoDB (Mongoose)
- RabbitMQ (amqplib)
- Redis (ioredis)
- JSON Web Tokens (JWT)
- Cloudinary (Image storage)
- Razorpay (Payment gateway)
- Nodemailer (Email notifications)

---

## 📁 Project Structure

```text
CineSlot/
├── backend/
│   ├── AuthService/       # Gateway & Authentication handling, routing to other services
│   ├── MovieService/      # Handles movie CRUD operations, Redis caching, and Cloudinary uploads
│   └── PaymentService/    # Razorpay integration, email generation, and payment verification
└── frontend/
    ├── adminend/          # Next.js application for theater admins
    └── userend/           # Next.js application for customers
```

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (Local or Atlas)
- RabbitMQ server running locally or via cloud
- Redis server
- Cloudinary Account
- Razorpay Account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CineSlot
   ```

2. **Setup Backend Microservices**
   For each service (`AuthService`, `MovieService`, `PaymentService`), navigate to the folder, install dependencies, and run:
   ```bash
   cd backend/<ServiceName>
   npm install
   ```

3. **Setup Frontend Applications**
   Navigate to both frontend applications, install dependencies:
   ```bash
   cd frontend/userend
   npm install
   
   cd ../adminend
   npm install
   ```

### Environment Variables setup

Create `.env` files in each of the respective backend service folders and frontend folders. 

**Backend (`AuthService`, `MovieService`, `PaymentService`) variables may include:**
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `RABBITMQ_URL`
- `REDIS_URL`
- `CLOUDINARY_URL`, `API_KEY`, `API_SECRET`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- `SMTP_USER`, `SMTP_PASS`

**Frontend (`userend`, `adminend`) variables may include:**
- `NEXT_PUBLIC_AuthSer_URL` (URL to the Auth/Gateway Service)
- `NEXT_PUBLIC_Razorpay_Key`
- `NEXT_PUBLIC_PaymentService_URL`

### Running the Application

1. **Start the Microservices**
   Open separate terminals for each backend service:
   ```bash
   # In backend/AuthService
   npm run dev
   
   # In backend/MovieService
   npm run dev
   
   # In backend/PaymentService
   npm run dev
   ```

2. **Start the Frontend Portals**
   Open separate terminals for the user and admin frontends:
   ```bash
   # In frontend/userend
   npm run dev
   
   # In frontend/adminend
   npm run dev
   ```

## 📜 License
This project is licensed under the ISC License.
