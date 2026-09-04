# 🎫 Event Ticketing Website

A full-stack event ticketing web application developed as part of the **Web Development course (01418441)** at **Kasetsart University, Kamphaeng Saen Campus**.

The application allows users to browse events, register and log in, purchase event tickets using an in-app coin system, and manage their tickets. Event organizers can create and manage events, upload event images, view ticket purchases, and verify tickets using QR codes.

---

## ✨ Features

### 👤 User / Attendee

* User registration
* User login and logout
* Session-based authentication
* Browse available events
* Search events by title
* View event details
* Purchase event tickets
* Purchase multiple tickets at once
* Coin-based payment system
* View purchased tickets
* View ticket QR codes
* View user profile
* Edit profile information
* View and manage coin balance

### 🎪 Organizer

* Organizer account registration
* Organizer dashboard
* Create new events
* Edit existing events
* Delete events
* Upload event images
* View events created by the organizer
* View ticket purchases for each event
* View ticket buyer information
* Scan / verify ticket QR codes
* Check ticket check-in status

### 🎟️ Ticket System

* Unique ticket ID for every ticket
* QR code generation for each ticket
* QR code-based ticket verification
* Prevent duplicate ticket check-in
* Track ticket purchase time
* Track ticket check-in status
* Automatically update the number of sold tickets

### ☁️ Image Upload

Event images are uploaded to **Cloudinary** instead of being stored directly on the server.

* Image upload using Multer
* Memory storage for uploaded files
* Cloudinary image hosting
* Supported formats:

  * `.jpg`
  * `.jpeg`
  * `.png`
* Maximum upload size: **2 MB**
* Uploaded images are stored in the `events` folder on Cloudinary

---

## 🛠️ Tech Stack

### Backend

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **EJS**
* **Express Session**
* **connect-mongo**

### Authentication & Security

* **bcrypt**
* **express-session**
* Session storage with MongoDB

### File & Image Handling

* **Multer**
* **Cloudinary**
* **Streamifier**

### Ticket & QR Code

* **QRCode**
* **UUID**

### Other Libraries

* **dotenv**
* **method-override**

### Development

* **Nodemon**

---

## 🏗️ Project Architecture

The project follows a simple server-side rendered architecture using **Node.js + Express.js + EJS + MongoDB**.

```text
Browser
   │
   ▼
Express.js
   │
   ├── Routes
   │    ├── Authentication
   │    ├── Events
   │    └── Organizer
   │
   ├── Middleware
   │    ├── Authentication
   │    ├── File Upload
   │    └── Cloudinary
   │
   ├── Models
   │    ├── User
   │    ├── Event
   │    └── Ticket
   │
   └── Services
        ├── MongoDB
        └── Cloudinary
```

---

## 📁 Project Structure

```text
Event-ticket-Website/
│
├── middleware/
│   ├── auth.js
│   ├── cloudinary.js
│   └── upload.js
│
├── models/
│   ├── Event.js
│   ├── Ticket.js
│   └── User.js
│
├── public/
│   ├── css/
│   ├── images/
│   └── ...
│
├── routes/
│   ├── auth.js
│   ├── events.js
│   └── organizer.js
│
├── utils/
│   └── ...
│
├── views/
│   ├── events/
│   ├── organizer/
│   ├── ...
│   └── ...
│
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Before running the project, make sure the following are installed:

* Node.js
* npm
* MongoDB
* Git

For event image uploads, a **Cloudinary account** is also required.

---

## 1. Clone the Repository

```bash
git clone https://github.com/Apiwat-Spice/Event-ticket-Website.git
```

Move into the project directory:

```bash
cd Event-ticket-Website
```

---

## 2. Install Dependencies

```bash
npm install
```

The project dependencies are defined in `package.json`, including Express, Mongoose, MongoDB, Cloudinary, Multer, bcrypt, QRCode, UUID, and other required packages.

---

# 🔐 Environment Variables

Create a `.env` file in the root directory of the project:

```text
Event-ticket-Website/
├── .env
├── app.js
├── package.json
└── ...
```

Add the following environment variables:

```env
PORT=3000

MONGO_URI=your_mongodb_connection_string

SESSION_SECRET=your_session_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## Environment Variables Reference

| Variable                | Required         | Description                      | Example              |
| ----------------------- | ---------------- | -------------------------------- | -------------------- |
| `PORT`                  | No               | Port used by the Express server  | `3000`               |
| `MONGO_URI`             | **Yes**          | MongoDB connection string        | `mongodb+srv://...`  |
| `SESSION_SECRET`        | **Yes**          | Secret used to sign session data | `your-random-secret` |
| `CLOUDINARY_CLOUD_NAME` | For image upload | Cloudinary cloud name            | `my-cloud`           |
| `CLOUDINARY_API_KEY`    | For image upload | Cloudinary API key               | `123456789`          |
| `CLOUDINARY_API_SECRET` | For image upload | Cloudinary API secret            | `xxxxxxxx`           |

> **Important:** Never commit your `.env` file to GitHub.

---

# 🗄️ MongoDB Setup

The application uses **MongoDB** as its primary database and **Mongoose** as the ODM.

The MongoDB connection is configured using:

```env
MONGO_URI=your_mongodb_connection_string
```

For MongoDB Atlas, the connection string generally looks like:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
```

Make sure your MongoDB deployment allows the machine running the application to connect.

---

# ☁️ Cloudinary Setup

Cloudinary is used to store event images.

Create a Cloudinary account and obtain:

* Cloud Name
* API Key
* API Secret

Then configure:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

The application uploads event images to the following Cloudinary folder:

```text
events/
```

Uploaded files are processed using Multer's memory storage and then sent to Cloudinary.

### Supported Image Types

```text
.jpg
.jpeg
.png
```

### Maximum File Size

```text
2 MB
```

---

# ▶️ Run the Application

Start the application with:

```bash
npm start
```

The current project uses Nodemon for the `start` script.

If the server starts successfully, open:

```text
http://localhost:3000
```

The application redirects the root page to:

```text
/events
```

---

# 🔑 Authentication

The application uses **session-based authentication**.

After a successful login, the user's information is stored in the Express session.

The application supports two main roles:

```text
attendee
organizer
```

### Attendee

Attendees can:

* Browse events
* Purchase tickets
* Manage their profile
* Manage coins
* View purchased tickets

### Organizer

Organizers can:

* Create events
* Edit events
* Delete events
* View ticket sales
* Verify tickets

The application redirects organizers to:

```text
/organizer/dashboard
```

while regular attendees are redirected to:

```text
/events
```

---

# 🎟️ Ticket Purchase Flow

The ticket purchase process works as follows:

```text
Browse Events
      │
      ▼
Select Event
      │
      ▼
Enter Ticket Quantity
      │
      ▼
Check Available Tickets
      │
      ▼
Check Coin Balance
      │
      ▼
Deduct Coins
      │
      ▼
Generate Ticket
      │
      ▼
Generate QR Code
      │
      ▼
Update Sold Tickets
      │
      ▼
Save Ticket
      │
      ▼
View Ticket in Profile
```

Each ticket receives a unique UUID and QR code. The QR code contains a URL used for organizer check-in.

---

# 📱 QR Code Check-in

Each purchased ticket receives a unique QR code.

The QR code points to a ticket verification endpoint similar to:

```text
/organizer/api/checkin/:qrCodeId
```

When an organizer verifies a ticket, the system checks:

1. Whether the ticket exists
2. Whether the organizer owns the event
3. Whether the ticket has already been checked in

If the ticket has already been used, the system rejects the check-in.

Otherwise, the ticket is marked as:

```text
checkedIn = true
```

and the check-in is recorded successfully.

---

# 🎪 Event Management

Organizers can manage their own events.

### Create Event

Organizers can provide:

* Event title
* Description
* Start date
* End date
* Location
* Total tickets
* Ticket price
* Event image

Event images are uploaded to Cloudinary before the event is saved to MongoDB.

### Edit Event

Organizers can update event information and optionally upload a new image.

### Delete Event

Organizers can delete events that belong to their account.

The application verifies event ownership before allowing edit or delete operations.

---

# 🔎 Event Search

Users can search events by title.

Example:

```text
/events?q=concert
```

The search is performed against the event title and is case-insensitive.

---

# 💰 Coin System

The application uses an internal coin system for demonstration purposes.

Users can:

* View their coin balance
* Add coins
* Spend coins when purchasing tickets

When a ticket is purchased:

```text
User Coins
     │
     ▼
Ticket Price × Quantity
     │
     ▼
Deduct from User
     │
     ▼
Add to Organizer
```

The system checks that the user has enough coins before completing a purchase.

---

# 📡 Main Routes

## Authentication

| Method | Route          | Description         |
| ------ | -------------- | ------------------- |
| GET    | `/register`    | Registration page   |
| POST   | `/register`    | Register a new user |
| GET    | `/login`       | Login page          |
| POST   | `/login`       | Authenticate user   |
| GET    | `/logout`      | Logout              |
| GET    | `/profile`     | User profile        |
| GET    | `/editprofile` | Edit profile page   |
| POST   | `/editprofile` | Update profile      |
| GET    | `/wallet`      | View coin wallet    |
| POST   | `/addcoin`     | Add coins           |
| POST   | `/delcoin`     | Remove coins        |

---

## Events

| Method | Route              | Description           |
| ------ | ------------------ | --------------------- |
| GET    | `/events`          | Display all events    |
| GET    | `/events/:id`      | Display event details |
| POST   | `/events/:id/book` | Purchase tickets      |

---

## Organizer

| Method | Route                              | Description          |
| ------ | ---------------------------------- | -------------------- |
| GET    | `/organizer/dashboard`             | Organizer dashboard  |
| GET    | `/organizer/events/new`            | Create event page    |
| POST   | `/organizer/events`                | Create event         |
| GET    | `/organizer/events/:id/edit`       | Edit event page      |
| PUT    | `/organizer/events/:id`            | Update event         |
| DELETE | `/organizer/events/:id`            | Delete event         |
| GET    | `/organizer/events/:id/tickets`    | View event tickets   |
| GET    | `/organizer/checkin`               | Ticket check-in page |
| GET    | `/organizer/api/checkin/:qrCodeId` | Verify ticket        |

---

# 🗃️ Database Models

The application uses MongoDB with Mongoose.

Main models include:

```text
User
 ├── name
 ├── username
 ├── email
 ├── birthdate
 ├── passwordHash
 ├── role
 └── coins

Event
 ├── title
 ├── description
 ├── startDate
 ├── endDate
 ├── location
 ├── totalTickets
 ├── soldTickets
 ├── price
 ├── image
 └── organizer

Ticket
 ├── event
 ├── buyer
 ├── quantity
 ├── totalPrice
 ├── qrCodeId
 ├── qrCodeData
 ├── checkedIn
 └── purchasedAt
```

---

# 🔄 Application Flow

```text
                    ┌──────────────┐
                    │    User      │
                    └──────┬───────┘
                           │
                    Register / Login
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
        ┌──────────┐                ┌───────────┐
        │ Attendee │                │ Organizer │
        └────┬─────┘                └─────┬─────┘
             │                            │
             ▼                            ▼
       Browse Events                Manage Events
             │                            │
             ▼                            ▼
       Event Details                 Create / Edit
             │                            │
             ▼                            ▼
       Buy Tickets                   View Tickets
             │                            │
             ▼                            ▼
       Generate QR                  Check-in QR
             │                            │
             └─────────────┬──────────────┘
                           ▼
                     MongoDB
                           │
                           ▼
                      Cloudinary
                    (Event Images)
```

---

# 🔒 Security Notes

The project uses several mechanisms to protect application data:

* Password hashing with bcrypt
* Session-based authentication
* MongoDB session storage
* Role-based authorization
* Organizer ownership validation
* Environment variables for sensitive configuration
* File type validation
* File size limitation

Sensitive credentials should always be stored in `.env` rather than committed to the repository.

---

# 🐛 Troubleshooting

## MongoDB Connection Error

If you see:

```text
MongoDB connection error
```

Check:

```env
MONGO_URI=...
```

Make sure the connection string is correct and MongoDB is accessible.

---

## Cloudinary Upload Error

Check the following variables:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Also make sure the uploaded file is:

```text
.jpg
.jpeg
.png
```

and smaller than:

```text
2 MB
```

---

## Session Problems

Make sure `SESSION_SECRET` is configured:

```env
SESSION_SECRET=your-long-random-secret
```

After changing session configuration, clear your browser cookies and log in again.

---

## Port Already in Use

If port `3000` is already being used, change:

```env
PORT=3000
```

to another available port:

```env
PORT=5000
```

Then access:

```text
http://localhost:5000
```

---

# 📦 Dependencies

Main dependencies used by the project include:

```text
express
mongoose
mongodb
ejs
bcrypt
express-session
connect-mongo
dotenv
multer
cloudinary
streamifier
qrcode
uuid
method-override
```

Development:

```text
nodemon
```

The exact versions are maintained in `package.json` and `package-lock.json`.

---

# 🎓 Academic Project

This project was developed for the course:

**01418441 – Web Development**

**Kasetsart University
Kamphaeng Saen Campus**

The project demonstrates full-stack web development concepts including:

* Server-side rendering
* MVC-style project organization
* RESTful routing
* Authentication
* Session management
* Database integration
* CRUD operations
* File uploading
* Cloud storage
* QR code generation
* Role-based authorization

---

# 👨‍💻 Author

**Apiwat Spice**

GitHub:

https://github.com/Apiwat-Spice

Repository:

https://github.com/Apiwat-Spice/Event-ticket-Website

---

# 📄 License

This project is developed for educational purposes.

---
