# Node.js Boilerplate

This boilerplate is a comprehensive starting point for building a robust and scalable Node.js application. It includes essential features and best practices to help you get up and running quickly.

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Process Management](#process-management)
- [Linting](#linting)
- [CI/CD](#ci-cd)
- [Backup](#backup)

## Getting Started

Follow these instructions to set up the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v14.x or later)
- MongoDB
- npm (v6.x or later)

## Features

- **MongoDB with Mongoose**: Utilize MongoDB's schema-based data modeling solution with Mongoose for efficient and organized database management.
- **JWT RS256**: Implement secure authentication and authorization using the robust JWT RS256 public key algorithm.
- **Joi**: Ensure data integrity with Joi, a powerful validation library for JavaScript.
- **Winston and Morgan**: Leverage Winston and Morgan for comprehensive logging solutions in your Node.js application.
- **Jest**: Employ Jest, a delightful JavaScript testing framework, to write and run unit and integration tests with ease.
- **Centralized Error Handling**: Adopt a middleware-based approach for consistent and centralized error handling across the application.
- **Swagger**: Document your RESTful APIs effortlessly with swagger-jsdoc and swagger-ui-express.
- **PM2**: Manage your Node.js application processes in production with PM2, an advanced process manager.
- **dotenv**: Load environment variables from a `.env` file to keep your configuration settings organized and secure.
- **Helmet**: Enhance your application's security by setting HTTP headers with Helmet.
- **Data Sanitization**: Protect against XSS and query injection attacks by sanitizing request data.
- **CORS**: Enable Cross-Origin Resource Sharing (CORS) to allow your API to be accessed from different domains.
- **Compression**: Improve your application's performance with gzip compression using the compression middleware.
- **GitHub Actions**: Automate your CI/CD pipeline with GitHub Actions for streamlined development workflows.
- **Codacy**: Maintain high code quality with automated reviews and monitoring through Codacy.
- **ESLint and Prettier**: Keep your codebase clean and consistent with linting and formatting tools ESLint and Prettier.
- **Email Functionality**: Incorporate essential email functionalities such as user registration, password reset, and resend link.
- **MongoDB Backup**: Schedule nightly backups of your MongoDB database to ensure data safety and reliability.
- **Logging**: Separate access and error logs for development and production environments to streamline troubleshooting and monitoring.

## Project Structure

```bash

├── .github (contains github action yml file)
├── build (contains build code)
├── public (contains directory)
├── routes (contains all src routes )
        ├── fileRoute.js
        ├── index.js
        ├── initRoute.js
        ├── mainRoute.js
├──src
    ├── _helpers
    ├── API (Here You Can Write all Your API)
        ├── USER
            ├── user.controller.private.js
            ├── user.controller.public.js
            ├── user.route.private.js
            ├── user.route.public.js
            ├── user.model.js
            ├── user.validate.js
            ├── user.services.js
        ├── OtherAPI
├── utils (having some utility function like dbBackup)
├── www
    ├── appOptions
        ├── compressionOption.js
        ├── corsOptions.js
        ├── helmetOption.js
        ├── rateLimitOption.js
    ├── errorHandler
        ├── errorHandler.js  
    ├── initServer
        ├── initDB.js
        ├── initDirectory.js
        ├── initRedis.js
        ├── initSentry.js
    ├── logger
        ├── morgonLogger.js
        ├── winstonLogger.js
├── .env
├── app.js
├── server.js
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── jest.config.js
├── package.json
├── ecosystem.config.js
└── README.md
└── webpack.config.js
```

## Installation

Follow these steps to set up the project on your local machine:

1. **Clone the repository:**

    ```sh
    git clone https://github.com/yourusername/nodejs-boilerplate.git
    cd nodejs-boilerplate
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the root directory and add the required environment variables. Refer to the `.env.example` file for the necessary variables.

    Example `.env` file:

    ```env
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/yourdbname
    JWT_SECRET=your_jwt_secret
    EMAIL_HOST=smtp.your-email.com
    EMAIL_PORT=587
    EMAIL_USER=your-email@example.com
    EMAIL_PASS=your-email-password
    ```

4. **Run the MongoDB server:**

    Make sure MongoDB is installed and running on your local machine or use a cloud-hosted MongoDB instance.

5. **Start the application in development mode:**

    ```sh
    npm run dev
    ```

6. **Start the application in production mode:**

    ```sh
    npm start
    ```

Your Node.js application should now be up and running. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## CI/CD

Automate your development workflow with GitHub Actions for continuous integration and deployment. Below is the configuration for setting up CI/CD for your Node.js application.

### GitHub Actions Configuration

Here is the `.github/workflows/nodejs.yml` file for your application:

```yaml
# This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions
```
### Explanation

- **Trigger:** The workflow is triggered on every push to the `main` branch.
- **Job:** The job named `build` runs on a self-hosted runner.
- **Node.js Setup:** The workflow uses the system Node.js version specified in the matrix (`20.x`).
- **Steps:**
  - Checkout the code from the repository.
  - Verify the Node.js and npm versions.
  - Install dependencies using `npm ci`.
  - Build the application (if a build script is present).
  - Create a `.env` file and populate it with environment variables from GitHub Secrets.
  - Restart the application using PM2 with the updated environment variables.
  - Wait for 10 seconds to ensure the server uses the new environment variables.
  - Delete the `.env` file for security reasons.

### Setting Up GitHub Secrets

To use the secrets in your workflow, you need to add them to your GitHub repository:

1. Go to your repository on GitHub.
2. Click on `Settings`.
3. Click on `Secrets` in the left sidebar.
4. Click on `New repository secret`.
5. Add all the required secrets (e.g., `NODE_PORT`, `CLIENT_URL`, `MONGODB_URI`, etc.).

## Backup

Ensure the safety and reliability of your MongoDB data by scheduling nightly backups. Below are the steps to set up and manage backups for your MongoDB database.

### MongoDB Backup Configuration

To automate the backup process, you can use a script that performs a dump of your MongoDB database and stores it in a specified directory. You can set this script to run every night using a cron job. like for every night use this  // 0 0 * * *
