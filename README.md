# Chat Application

A full-stack real-time chat application with user authentication, friend requests, file sharing, notifications, and online presence, built with Node.js, Express, MongoDB, React, and Socket.IO.

---

## Features

- **User Authentication**: Signup, login, logout, password reset, and strong password validation.
- **Profile Management**: Change profile photo, update password, and view user details.
- **Friend System**: Send/cancel/accept/reject friend requests, unfriend, block/unblock users, and search for users.
- **Conversations & Messaging**:
  - Real-time messaging and file sharing (images/videos).
  - AI-powered chat (optional).
  - Message history, last message preview, and notifications.
- **Online Presence**: See which friends are online, and get notified when friends come online/offline.
- **Multiple Device Detection**: Prevents simultaneous logins from multiple tabs/devices.
- **Cloud Storage**: Profile photos and files are stored securely on AWS S3.

---

## Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.IO
- **Frontend**: React, Tailwind CSS
- **Cloud Storage**: AWS S3
- **Authentication**: JWT, bcrypt
- **Other**: Email notifications, strong password validation

---

## Project Structure

```
Chat_application/
│
├── backend/
│   ├── controllers/         # All route controllers (user, message, etc.)
│   ├── models/              # Mongoose models
│   ├── routes/              # Express routes
│   ├── utils/               # Utility functions (AWS, email, encryption, etc.)
│   ├── socketServer.js      # Socket.IO server logic
│   └── app.js               # Express app setup
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages (including AnotherInstanceActivePage)
│   │   ├── components/      # Reusable UI components
│   │   └── ...              # Other React files
│   └── ...                  # React config, public, etc.
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB
- AWS S3 bucket (for file storage)
- (Optional) Email service for password reset

### Environment Variables

Create a `.env` file in the `backend/config` directory with the following:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
UPLOADS_DIR_AVATAR=avatars/
UPLOADS_DIR_FILES=files/
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_bucket_name
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Installation

#### Backend

```powershell
cd backend
npm install
npm start
```

#### Frontend

```powershell
cd frontend
npm install
npm start
```

---

## Usage

- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Register a new account, login, add friends, and start chatting in real-time.
- Upload profile photos and share images/videos in chat.
- If you open the app in another tab/device, you'll see a warning and be logged out from the previous session.

---

## Security

- Passwords are hashed using bcrypt.
- JWT is used for authentication.
- Files are stored securely on AWS S3 with signed URLs.
- Sensitive data (like AWS keys) should **never** be committed to source control.

---

## License

This project is for educational purposes.

---

## Credits

- Built with [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), [React](https://react.dev/), [Socket.IO](https://socket.io/), and [AWS S3](https://aws.amazon.com/s3/).
