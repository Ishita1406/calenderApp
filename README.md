# Calendar App

## Overview
The Calendar App allows users to schedule and manage events with ease. It provides basic CRUD (Create, Read, Update, Delete) functionality for events. Users can attach media (pictures, videos) to events and receive browser notifications for scheduled tasks. The notifications are dismissable, and users can snooze them for 5 minutes.

## Features
- **User Authentication**: Login and signup functionality to ensure secure access.
- **Event Scheduling**: Create, view, edit, and delete events with optional text, images, and videos.
- **Event Notifications**: Receive browser notifications at the time of the event, with the option to snooze for 5 minutes.
- **CRUD Operations**: Full functionality for creating, viewing, editing, and deleting events.
- **Snooze and Dismiss Notifications**: Notifications can be snoozed or dismissed based on user preference.
- **UI**: A simple and responsive user interface built with React for efficient event management.

## Technologies Used
### Frontend:
- **React**: For building the user interface.
- **Axios**: For making API requests to the backend.
- **CSS/HTML**: For styling and layout.

### Backend:
- **Node.js**: For handling server-side logic.
- **Express.js**: For managing API requests and routes.
- **MongoDB**: For storing user data and event details.
- **Cloudinary**: For storing and serving media files (images, videos).

## Flow Logic
1. **User Authentication**: 
    - Users can sign up and log in securely to access the calendar.
2. **Create Events**:
    - Users can add events with a title, description, date/time, and optional media (pictures/videos).
3. **Read Events**:
    - Events are displayed in a calendar view with the ability to click on events for more details.
4. **Update Events**:
    - Users can edit existing events.
5. **Delete Events**:
    - Events can be deleted from the calendar.
6. **Notifications**:
    - A browser notification is triggered when an event is scheduled to occur.
    - Users can snooze the notification to receive it again after 5 minutes.
    - Notifications can be dismissed if the user no longer needs them.

## Setup Instructions

### 1. Install Dependencies:
#### Frontend:
Navigate to the frontend directory and install the dependencies:
```bash
cd client
npm install
```

#### Backend:

1. Navigate to the backend directory and install dependencies:
```bash
npm install
```

### 2. Environment Configuration:

Create a `.env` file in the root of your backend project with the following variables and replace wiht your values:

```env
# MongoDB Connection URI
MONGO_URL=your_MONGODB_Url

# Server Port
PORT=portNumber

# JWT Secret for Authentication
JWT_SECRET=secretVariable

# Cloudinary Configuration for Media Uploads
CLOUDINARY_CLOUD_NAME=Cloud_name
CLOUDINARY_API_KEY=Api_key
CLOUDINARY_API_SECRET=Api_secret
```
### 3. Run the Backend
Start the backend server:

```bash
npm run dev
```

### 4. Run the Frontend
Start the Frontend React App:
```bash
cd client
npm run dev
```
