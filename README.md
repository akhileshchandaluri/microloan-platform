🏦 Microloan Platform

🚀 Project Overview

The Microloan Platform is a full-stack application built using the MERN stack (MongoDB, Express, React, Node.js). It is designed to manage the full lifecycle of micro-loans, including application submission, administrative approval, and repayment tracking.

This repository contains two main parts:

/server: The Node.js/Express backend, responsible for APIs, database connection, and core business logic.

/client: The React frontend, which provides the user interface, styled using Tailwind CSS.

⚙️ Getting Started (Initial Setup)

Follow these steps to set up the project locally for development.

1. Prerequisites

Before you start, make sure you have the following installed:

Node.js & npm (Node Package Manager)

A MongoDB Atlas account (to host our database)

Git (for version control)

2. Repository Cloning

If you haven't already, clone the repository and navigate into the project directory:

git clone [https://github.com/](https://github.com/)<your-username>/microloan-platform.git
cd microloan-platform


3. Backend Setup

This step sets up the core server and links it to our database.

Navigate into the server folder:

cd server


Install all required dependencies (Express, Mongoose, etc.):

npm install


Crucial Step: Environment Variables
Create a file named .env inside the /server directory. This file holds secrets like the MongoDB connection string. Add the following line, replacing your_connection_string_from_mongodb_atlas with the actual URI you get from MongoDB Atlas:

MONGO_URI=your_connection_string_from_mongodb_atlas


4. Frontend Setup

This sets up the user interface.

Return to the project root and navigate into the client folder:

cd ..
cd client


Install all required dependencies (React, Tailwind, etc.):

npm install


▶️ Running the Application

To run the full application, you need two separate terminal windows open: one for the server and one for the client.

Step A: Start the Backend (Server)

From the /server directory:

node server.js


The console should confirm the database connection and server port: MongoDB connected and Server on 5000.

Step B: Start the Frontend (Client)

From the /client directory:

npm start


This will automatically open the application in your web browser (typically at http://localhost:3000).