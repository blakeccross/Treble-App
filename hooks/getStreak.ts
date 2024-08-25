import moment from 'moment';

export default function longestConsecutiveDays(dates: (string | Date)[]): number {
    if (dates.length === 0) return 0;

    // Convert dates to moment objects, normalize to start of day, and sort them
    const datesMoment = dates
        .map(date => moment(new Date(date)).startOf('day')) // Normalize to the start of the day
        .sort((a, b) => a.valueOf() - b.valueOf());

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < datesMoment.length; i++) {
        const diffInDays = datesMoment[i].diff(datesMoment[i - 1], 'days');

        if (diffInDays === 1) {
            currentStreak += 1;
        } else if (diffInDays > 1) {
            // Reset current streak if the difference is greater than 1 day
            longestStreak = Math.max(longestStreak, currentStreak);
            currentStreak = 1;
        }
    }

    // Return the longest streak found
    return Math.max(longestStreak, currentStreak);
}
