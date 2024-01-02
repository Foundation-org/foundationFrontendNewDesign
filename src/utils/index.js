export function calculateRemainingTime(lastInteractedAt, usersChangeTheirAns) {
    console.log("first", lastInteractedAt, usersChangeTheirAns);
    const now = new Date();
    const lastInteractionDate = new Date(lastInteractedAt);
    const timeDifference = now - lastInteractionDate;
    
    const remainingDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const monthlyChangeThreshold = 10;

    if (
      usersChangeTheirAns.toLowerCase() === "monthly" &&
      remainingDays <= monthlyChangeThreshold
    ) {
      return `Only ${remainingDays} day${
        remainingDays === 1 ? "" : "s"
      } remaining for your monthly change.`;
    }

    const units = ["year", "month", "day", "hour", "second"];
    const unitValues = [
      365 * 24 * 60 * 60 * 1000, 
      30.44 * 24 * 60 * 60 * 1000, 
      24 * 60 * 60 * 1000, 
      60 * 60 * 1000, 
      1000, 
    ];

    for (let i = 0; i < units.length; i++) {
      const unitValue = unitValues[i];
      const unitCount = Math.floor(timeDifference / unitValue);

      if (unitCount > 0) {
        return `Only ${unitCount} ${units[i]}${
          unitCount === 1 ? "" : "s"
        } remaining.`;
      }
    }

    return "No time remaining.";
  }