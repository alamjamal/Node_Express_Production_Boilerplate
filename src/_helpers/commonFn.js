const crypto = require('crypto');
const { differenceInSeconds } = require('date-fns');

const generateRandomString = (length) => {
    // Generate 3 random bytes (24 bits)
    const randomBytes = crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0,length)
    return randomBytes;
}




function calculateRemainingMS(expireAt) {
    const currentTime = new Date();
    const diffSeconds = differenceInSeconds(expireAt,currentTime );

    // Calculate minutes and seconds from total seconds
    const minutes = Math.floor(diffSeconds / 60);
    const seconds = diffSeconds % 60;

    return {
        minutes: minutes,
        seconds: seconds,
    };
}


module.exports = { generateRandomString ,calculateRemainingMS}
