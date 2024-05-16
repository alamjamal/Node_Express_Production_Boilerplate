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
.
├──:file_folder:src
    ├──_helpers
        ├──appOptions
        ├──errorHandler
        ├──htmlTemplate
        ├──logger
    ├── API
        ├──USER
            ├──user.controller.private.js
            ├──user.controller.public.js
            ├──user.route.private.js
            ├──user.route.public.js
            ├──user.model.js
            ├──user.validate.js
            ├──user.services.js
        ├──OtherAPI
├──initServer
        ├──initDB.js
        ├──initDirectory.js
        ├──initRedis.js
        ├──initSentry.js
├──routes
        ├──fileRoute.js
        ├──index.js
        ├──initRoute.js
        ├──mainRoute.js
├── utils
├── app.js
├── server.js
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── jest.config.js
├── package.json
├── pm2.config.js
└── README.md
