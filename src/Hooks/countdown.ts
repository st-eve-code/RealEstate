// useDynamicCountdown.js or similar utility file

import { useState, useEffect } from 'react';

/**
 * Calculates the time remaining until a target date and formats it dynamically.
 * @param {Date} targetDate The date the countdown ends.
 * @returns {string} The formatted time remaining (e.g., "5 days", "12 hours", "34 minutes").
 */
const useDynamicCountdown = (targetDate: Date) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = targetDate.getTime() - Date.now();

            if (difference <= 0) {
                setTimeLeft('Expired');
                return;
            }

            const minutes = Math.floor(difference / 1000 / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) {
                setTimeLeft(`${days} day${days > 1 ? 's' : ''}`);
            } else if (hours > 0) {
                setTimeLeft(`${hours} hour${hours > 1 ? 's' : ''}`);
            } else if (minutes > 0) {
                setTimeLeft(`${minutes} minute${minutes > 1 ? 's' : ''}`);
            } else {
                // If less than a minute, show seconds or "less than a minute"
                setTimeLeft('less than a minute'); 
            }
        };

        // Update the countdown immediately and every minute thereafter
        calculateTimeLeft();
        // Update every 60 seconds (60000ms) to keep minutes/hours accurate
        const intervalId = setInterval(calculateTimeLeft, 60000); 

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [targetDate]);

    return timeLeft;
};

export default useDynamicCountdown;
