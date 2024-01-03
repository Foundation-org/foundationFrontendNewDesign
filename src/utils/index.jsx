// import {
//   differenceInDays,
//   differenceInHours,
//   formatDistanceToNow,
// } from "date-fns";
import { toast } from "sonner";

// export function calculateRemainingTime(lastInteractedAt, usersChangeTheirAns) {
//     const lastInteractionDate = new Date(lastInteractedAt);
//     const currentDate = new Date();

//     console.log({ lastInteractedAt });
//     console.log({ currentDate });

//     let remainingTime;

//     switch (usersChangeTheirAns) {
//         case 'Monthly':
//             remainingTime = formatDistanceToNow(lastInteractionDate, { addSuffix: true }).split(" ")[0] * 1;
//             if (remainingTime >= 30) {
//                 return "You can interact now";
//             } else {
//                 const pendingTime = 30 - remainingTime;
//                 return `You have to wait ${pendingTime} days.`
//             }
//         case 'Daily':
//             remainingTime = differenceInHours(currentDate, lastInteractionDate);
//             if (remainingTime >= 24) {
//                 return "You can interact now";
//             }
//             break;
//         case 'Hourly':
//             remainingTime = differenceInHours(currentDate, lastInteractionDate);
//             break;
//         default:
//             throw new Error('Invalid value for usersChangeTheirAns');
//     }

//     const timeUnit = usersChangeTheirAns === 'Monthly' ? 'month' : usersChangeTheirAns.toLowerCase() === "daily" ? "hour" : usersChangeTheirAns.toLowerCase();
//     const formattedTime = formatDistanceToNow(lastInteractionDate, { addSuffix: true });

//     if (lastInteractedAt !== null) {
//         return `${remainingTime} ${timeUnit}${remainingTime !== 1 ? 's' : ''} remaining (Last interaction: ${formattedTime})`;
//     } else {
//         return "You can interact now";
//     }
// }

export function calculateRemainingTime(
  lastInteractedAt,
  howManyTimesAnsChanged,
) {
  let usersChangeTheirAns;

  const validateInterval = () => {
    // Define the time interval (in milliseconds) based on usersChangeTheirAns value
    let timeInterval = 0;
    if (usersChangeTheirAns === "Daily") {
      return (timeInterval = 24 * 60 * 60 * 1000); // 24 hours in milliseconds
    } else if (usersChangeTheirAns === "Weekly") {
      return (timeInterval = 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
    } else if (usersChangeTheirAns === "Monthly") {
      // Assuming 30 days in a month for simplicity
      return (timeInterval = 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
    } else if (usersChangeTheirAns === "Yearly") {
      // Assuming 365 days in a year for simplicity
      return (timeInterval = 365 * 24 * 60 * 60 * 1000); // 365 days in milliseconds
    } else if (usersChangeTheirAns === "TwoYears") {
      // Assuming 2 years
      return (timeInterval = 2 * 365 * 24 * 60 * 60 * 1000); // 2 years in milliseconds
    } else if (usersChangeTheirAns === "FourYears") {
      // Assuming 4 years
      return (timeInterval = 4 * 365 * 24 * 60 * 60 * 1000); // 4 years in milliseconds
    }
  };

  const currentDate = new Date();

  const timeInterval = validateInterval();
  // Check if enough time has passed
  if (
    howManyTimesAnsChanged > 1 &&
    currentDate - new Date(lastInteractedAt) < timeInterval
  ) {
    // Alert the user if the time condition is not met
    toast.error(`You can change your answer in ${usersChangeTheirAns}.`);
  } else {
    toast.success(`You are good to go!`);
  }
}
