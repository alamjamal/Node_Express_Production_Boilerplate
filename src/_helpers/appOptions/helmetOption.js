const helmet = require("helmet");

const helmetOption = {
    xssFilter: true, // Enables XSS filtering
    frameguard: {
        action: 'deny', // Prevents clickjacking
    },
    hsts: {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        includeSubDomains: true,
        preload: true,
    },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "https://*.example.com"], // Allow images from example.com subdomains
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
        },
    },
}

const helmetSetup = helmet(helmetOption)
module.exports = helmetSetup