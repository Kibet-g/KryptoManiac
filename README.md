# Crypto Hunter - MERN Stack Web App


Crypto Hunter is a full-stack web application for tracking and analyzing cryptocurrency data. This project is built using the MERN (MongoDB, Express.js, React, Node.js) stack.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies-used)


## Features

- **User Authentication**: User registration and login functionality with JWT authentication.
- **Cryptocurrency Data**: Display real-time cryptocurrency data including prices, charts, and historical data.
- **Favorites**: Users can add cryptocurrencies to their favorites list.
- **News Section**: Display the latest news related to cryptocurrencies.
- **User Profiles**: Users can create and manage their profiles.
- **Responsive Design**: A mobile-friendly interface for easy access on various devices.

## Getting Started

To get the project up and running on your local machine, follow these steps:

### Prerequisites

- Node.js and npm installed on your development machine.
- MongoDB installed locally or accessible via a cloud-based MongoDB service.
- API keys (if required for external services).

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kumarAmar882/crypto_hunting.git
   cd crypto_hunting
2. Install server dependencies:

    ```bash
    cd server
    npm install

3. Configure the environment variables:
- Create a .env file in the server directory and add the following variables:

   ```bash
    PORT=3001
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
4. Install client dependencies:

    ```bash
    cd ../client
    npm install

5. Start the development server:

    ```bash
    npm start
6. The app should now be running at http://localhost:3000.

### Usage
- Register or log in to your account.
- Explore cryptocurrency data, add favorites, and stay updated with the latest news.

### Technologies Used

**Frontend:**

- React (create-react-app)
- Redux for state management
- React Router for client-side routing
- Chart.js for cryptocurrency charts
- Axios for HTTP requests

**Backend:**

- Node.js with Express.js
- MongoDB for the database
- Mongoose for database modeling
- Passport.js for user authentication
- JWT for token-based authentication


