# E-Commerce Store

This is a full-stack e-commerce application with a Node.js backend and a static HTML, CSS, and JavaScript frontend.

## Prerequisites

- Node.js and npm installed on your machine.
- MongoDB database (local or cloud).

## Getting Started

To get the application up and running locally, follow these steps.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create an environment file:**

    Create a `.env` file in the `backend` directory and add the following environment variables.

    ```
    PORT=5000
    MONGO_URI=<your_mongodb_connection_string>
    JWT_SECRET=<your_jwt_secret>
    ```

    Replace `<your_mongodb_connection_string>` with your actual MongoDB connection string and `<your_jwt_secret>` with a long, random string.

4.  **Start the backend server:**
    ```bash
    npm run dev
    ```

    The backend server will be running on `http://localhost:5000` (or the port you specified in your `.env` file).

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Serve the frontend application:**

    The simplest way to serve the frontend is using the `serve` package. If you don't have it installed globally, you can use `npx`.

    ```bash
    npx serve
    ```

    The frontend will be available at the URL provided by the `serve` command (usually `http://localhost:3000`).

## Usage

Once both the backend and frontend are running, you can open your browser and navigate to the frontend URL to use the application. 
