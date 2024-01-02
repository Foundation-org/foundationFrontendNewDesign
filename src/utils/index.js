import { differenceInDays, differenceInHours, differenceInMonths, formatDistanceToNow } from "date-fns"

export function calculateRemainingTime(lastInteractedAt, usersChangeTheirAns) {
    const lastInteractionDate = new Date(lastInteractedAt);
    const currentDate = new Date();

    console.log({lastInteractedAt});
    console.log({currentDate});

    let remainingTime;

    switch (usersChangeTheirAns) {
        case 'Monthly':
            remainingTime = Math.floor(differenceInDays( lastInteractionDate,currentDate) / 24);  
        // remainingTime = differenceInMonths(currentDate, lastInteractionDate);
            // if (currentDate.getDate() < lastInteractionDate.getDate()) {
            //     remainingTime--;
            // }
            break;
        case 'Daily':
            remainingTime = Math.floor(differenceInDays(currentDate, lastInteractionDate) / 24);
            break;
        case 'Hourly':
            remainingTime = differenceInHours(currentDate, lastInteractionDate);
            break;
        default:
            throw new Error('Invalid value for usersChangeTheirAns');
    }

    const timeUnit = usersChangeTheirAns === 'Monthly' ? 'month' : usersChangeTheirAns.toLowerCase() === "daily" ? "day" : usersChangeTheirAns.toLowerCase();
    const formattedTime = formatDistanceToNow(lastInteractionDate, { addSuffix: true });

    if(lastInteractedAt !== null) {
        return `${remainingTime} ${timeUnit}${remainingTime !== 1 ? 's' : ''} remaining (Last interaction: ${formattedTime})`;
    } else {
        return "You can interact now"
    }

    // return `${remainingTime} ${timeUnit}${remainingTime !== 1 ? 's' : ''}`;
}