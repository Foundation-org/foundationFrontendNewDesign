import { FaSpinner } from 'react-icons/fa';
export function calculateRemainingTime(lastInteractedAt, howManyTimesAnsChanged, usersChangeTheirAns) {
  const validateInterval = () => {
    let timeInterval = 0;
    if (usersChangeTheirAns === 'Daily') {
      return (timeInterval = 24 * 60 * 60 * 1000);
    } else if (usersChangeTheirAns === 'Weekly') {
      return (timeInterval = 7 * 24 * 60 * 60 * 1000);
    } else if (usersChangeTheirAns === 'Monthly') {
      return (timeInterval = 30 * 24 * 60 * 60 * 1000);
    } else if (usersChangeTheirAns === 'Yearly') {
      return (timeInterval = 365 * 24 * 60 * 60 * 1000);
    } else if (usersChangeTheirAns === 'TwoYears') {
      return (timeInterval = 2 * 365 * 24 * 60 * 60 * 1000);
    } else if (usersChangeTheirAns === 'FourYears') {
      return (timeInterval = 4 * 365 * 24 * 60 * 60 * 1000);
    }
  };

  const currentDate = new Date();
  const timeInterval = validateInterval();

  if (howManyTimesAnsChanged >= 1 && currentDate - new Date(lastInteractedAt) < timeInterval) {
    let futureDate = new Date(currentDate.getTime() + timeInterval);

    const timeDifference = futureDate - currentDate;
    const days = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    const twoYears = Math.floor(days / (2 * 365));
    const fourYears = Math.floor(days / (4 * 365));

    const remainingTime = [
      days > 0 ? days === 1 ? "24 hours" : days === 365 ? "12 months" : `${days} days` : null,
      weeks > 0 ? `${weeks} weeks` : null,
      months > 0 ? `${months} months` : null,
      years > 0 ? `${years} years` : null,
      twoYears > 0 ? `${twoYears} two years` : null,
      fourYears > 0 ? `${fourYears} four years` : null,
    ]
      .filter(Boolean)
      .join(', ');

    return `, after ${remainingTime.split(',')[0]}`;
  } else {
    return ', you are good to go';
  }
}

export const handleClickScroll = () => {
  const element = document.getElementById('section-1');
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export const printNoRecordsMessage = (persistedTheme) => {
  return (
    <div className="my-[15vh] flex  flex-col justify-center items-center">
      {persistedTheme === 'dark' ? (
        <img src="/assets/svgs/dashboard/noMatchingDark.svg" alt="noposts image" />
      ) : (
        <img src="/assets/svgs/dashboard/noMatchingLight.svg" alt="noposts image" className="w-[160px] h-[173px]" />
      )}
      <p className="font-inter mt-[1.319vw] text-center text-[2.083vw] text-[#9F9F9F] dark:text-gray font-bold">
        No Matching Posts Found
      </p>
    </div>
  );
};

export const printEndMessage = (feedData, filterStates, allData, persistedTheme) => {
  return feedData?.hasNextPage === false ? (
    <div className="flex justify-between gap-4 px-4 pt-3 pb-[5rem] tablet:py-[27px]">
      <div></div>
      {filterStates.searchData && allData.length == 0 ? (
        <div className="my-[15vh] flex  flex-col justify-center items-center">
          {persistedTheme === 'dark' ? (
            <img src="/assets/svgs/dashboard/noMatchingDark.svg" alt="noposts image" />
          ) : (
            <img src="/assets/svgs/dashboard/noMatchingLight.svg" alt="noposts image" className="w-[160px] h-[173px]" />
          )}
          <p className="font-inter mt-[1.319vw] text-center text-[2.083vw] text-[#9F9F9F] dark:text-gray font-bold">
            No Matching Posts Found
          </p>
        </div>
      ) : !filterStates.searchData && allData.length === 0 ? (
        <>{printNoRecordsMessage(persistedTheme)}</>
      ) : (
        !filterStates.searchData && (
          <p className="text-center text-[4vw] tablet:text-[2vw]">
            <b>You are all caught up!</b>
          </p>
        )
      )}
      <div></div>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <FaSpinner className="animate-spin text-[10vw] text-blue tablet:text-[4vw]" />
    </div>
  );
};

export const validateInterval = (usersChangeTheirAns) => {
  let timeInterval = 0;
  if (usersChangeTheirAns === 'Daily') {
    return (timeInterval = 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  } else if (usersChangeTheirAns === 'Weekly') {
    return (timeInterval = 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
  } else if (usersChangeTheirAns === 'Monthly') {
    // Assuming 30 days in a month for simplicity
    return (timeInterval = 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
  } else if (usersChangeTheirAns === 'Yearly') {
    // Assuming 365 days in a year for simplicity
    return (timeInterval = 365 * 24 * 60 * 60 * 1000); // 365 days in milliseconds
  } else if (usersChangeTheirAns === 'TwoYears') {
    // Assuming 2 years
    return (timeInterval = 2 * 365 * 24 * 60 * 60 * 1000); // 2 years in milliseconds
  } else if (usersChangeTheirAns === 'FourYears') {
    // Assuming 4 years
    return (timeInterval = 4 * 365 * 24 * 60 * 60 * 1000); // 4 years in milliseconds
  }
};

export const capitalizeFirstLetter = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
