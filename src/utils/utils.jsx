export const formatCountNumber = (num) => {
  if (num >= 1000) {
    const formatted = (num / 1000).toLocaleString(undefined, { minimumFractionDigits: num % 1000 !== 0 ? 1 : 0 });
    return formatted + 'k';
  }
  return num.toLocaleString();
};

export function formatDate(timestamp) {
  const date = new Date(timestamp);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

export function formatDateMDY(timestamp) {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are 0-based, so add 1
  const year = date.getFullYear();
  const formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
}

export const calculateTimeAgo = (time) => {
  const currentDate = new Date();
  const createdAtDate = new Date(time);

  if (isNaN(createdAtDate.getTime())) {
    return 'Invalid date';
  }

  const timeDifference = currentDate - createdAtDate;
  const seconds = Math.floor(Math.max(timeDifference / 1000, 0));
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (seconds > 0) {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
  } else {
    return 'Just now';
  }
};

export const capitalizeFirstLetter = (sentence) => {
  if (!sentence) return sentence;
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
};

export function camelCaseToReadable(text) {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert space before each uppercase letter
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
}
