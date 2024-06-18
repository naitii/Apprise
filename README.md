# Apprise - Social Media Platform

Welcome to Apprise, a dynamic social media platform designed to bring people together through engaging features. This README file will guide you through the installation, features, and usage of Apprise.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Deployement](#deployment)

## Features

Apprise offers a range of features to enhance the social media experience:

- **User Authentication**: Secure sign-up and login using email and password.
- **Create Post**: Share your thoughts, images, and links with your friends.
- **Like Post**: Show appreciation for posts by liking them.
- **Comment**: Engage in conversations by commenting on posts.
- **Like Comment**: Like comments to show agreement or appreciation.
- **Real-Time Chat**: Chat with friends in real-time, supporting text and image messages.
- **Notifications**: Stay updated with notifications for likes, comments, friend requests, and more.
- **Profile Management**: Update your profile with personal information, profile picture, and bio.
- **Friend Management**: You can add friends or remove your existing friends.Added friend will be notified for the same.

## Installation

Follow these steps to set up Apprise on your local machine:

### Prerequisites

- Node.js
- npm (Node Package Manager)
- MongoDB (for database)
- A code editor (e.g., VSCode)

### Backend Setup

1. Clone the repository:
   ```sh
    git clone https://github.com/naitii/Apprise.git
    cd Apprise/backend

2. Install Dependencies:
   ```sh
    npm i
3. Set up environment variables:
    Create a .env file in the backend directory with the following contents:
   ```sh
    PORT = 5000
    MONGO_URI = your_mongodb_uri
    JWT_SECRET= your_jwt_secret
    ClOUDINARY_CLOUD_NAME = your_cloud_name
    CLOUDINARY_API_KEY = your_api_key
    CLOUDINARY_API_SECRET = your_api_secret
3. Start the server:
   ```sh
    npm start

### Frontend Setup
1. Navigate to the frontend directory:
   ```sh
     cd ../frontend
2. Install Dependencies
     ```sh
     npm i
3. Start development
    ```sh
     npm run dev

## Usage

Once the server and frontend are running, you can start using Apprise by navigating to `http://localhost:3000` in your web browser.

### Key Operations

1. **Sign Up / Log In**:
   - Create a new account or log in to an existing one.

2. **Create a Post**:
   - Use the post creation form to share your content.

3. **Interact with Posts**:
   - Like posts and add comments.

4. **Real-Time Chat**:
   - Use the chat feature to communicate with friends.

5. **Manage Profile**:
   - Update your profile details and pictures.

6. **Manage Friends**:
   - You can add friends or remove your existing friends.Added friend will be notified for the same.
  
## Deployment

Apprise is deployed and accessible online. You can visit the deployed site at [Apprise](https://apprise-g8yj.onrender.com).

    
