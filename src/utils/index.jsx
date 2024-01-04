import { toast } from "sonner";

export function calculateRemainingTime(
  lastInteractedAt,
  howManyTimesAnsChanged,
  usersChangeTheirAns,
) {
  const validateInterval = () => {
    let timeInterval = 0;
    if (usersChangeTheirAns === "Daily") {
      return (timeInterval = 24 * 60 * 60 * 1000);
    } else if (usersChangeTheirAns === "Weekly") {
      return (timeInterval = 7 * 24 * 60 * 60 * 1000);
    } else if (usersChangeTheirAns === "Monthly") {
      return (timeInterval = 30 * 24 * 60 * 60 * 1000);
    } else if (usersChangeTheirAns === "Yearly") {
      return (timeInterval = 365 * 24 * 60 * 60 * 1000);
    } else if (usersChangeTheirAns === "TwoYears") {
      return (timeInterval = 2 * 365 * 24 * 60 * 60 * 1000);
    } else if (usersChangeTheirAns === "FourYears") {
      return (timeInterval = 4 * 365 * 24 * 60 * 60 * 1000);
    }
  };

  const currentDate = new Date();
  const timeInterval = validateInterval();

  if (
    howManyTimesAnsChanged >= 1 &&
    currentDate - new Date(lastInteractedAt) < timeInterval
  ) {
    let currentDate = new Date();
    let futureDate = new Date(currentDate.getTime() + timeInterval);
    let futureDateTimeString = futureDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    toast.error(`You can change your answer after ${futureDateTimeString}.`);
  } else {
    toast.success(`You are good to go!`);
  }
}
