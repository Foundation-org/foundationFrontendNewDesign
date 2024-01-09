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
    let futureDate = new Date(currentDate.getTime() + timeInterval);

    const timeDifference = futureDate - currentDate;
    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    const twoYears = Math.floor(days / (2 * 365));
    const fourYears = Math.floor(days / (4 * 365));

    const remainingTime = [
      days > 0 ? `${days} days` : null,
      weeks > 0 ? `${weeks} weeks` : null,
      months > 0 ? `${months} months` : null,
      years > 0 ? `${years} years` : null,
      twoYears > 0 ? `${twoYears} two years` : null,
      fourYears > 0 ? `${fourYears} four years` : null,
    ]
      .filter(Boolean)
      .join(", ");

    return `, after ${remainingTime.split(",")[0]}.`;
  } else {
    return ", you are good to go!";
  }
}

export const handleClickScroll = () => {
  const element = document.getElementById("section-1");
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};
