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

export const saveScrollPosition = () => {
  const scrollableElement = document.getElementById('scrollable-list');
  if (scrollableElement) {
    sessionStorage.setItem('scrollPosition', scrollableElement.scrollTop.toString());
  }
};
