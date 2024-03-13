export default function SortIcon({ type, ass, des }) {
  let color = '#4DD896';
  if (type === 'contended') {
    color = '#FDD503';
  } else {
    color = '#4DD896';
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="20"
      viewBox="0 0 14 20"
      fill="none"
      className="h-[11.561px] w-[7.593px] cursor-pointer tablet:h-5 tablet:w-[13.12px]"
    >
      <path
        d="M6.74226 7.2242C4.79664 7.2242 2.85121 7.2242 0.905961 7.2242C0.359644 7.2242 0.0318552 6.73791 0.255845 6.27842C0.300907 6.19405 0.35982 6.11786 0.43012 6.05305C2.36554 4.11483 4.30131 2.17696 6.23746 0.239467C6.55596 -0.0794379 6.92636 -0.0805319 7.24596 0.239467C9.18247 2.17624 11.1182 4.11392 13.0533 6.05251C13.2718 6.27131 13.3609 6.51801 13.2478 6.81449C13.1451 7.08799 12.9052 7.22529 12.5578 7.22529C10.6198 7.22529 8.68131 7.22493 6.74226 7.2242Z"
        fill={des ? color : '#B5B5B5'}
      />
      <path
        d="M6.73713 12.7755C8.66043 12.7755 10.5841 12.7755 12.5081 12.7755C12.8303 12.7755 13.0869 12.8679 13.2266 13.1746C13.3533 13.4512 13.2812 13.7087 13.0083 13.982C11.0984 15.895 9.18748 17.8084 7.27546 19.7221C6.90747 20.0905 6.5575 20.0922 6.19442 19.7286C4.27949 17.8087 2.36456 15.8897 0.449628 13.9717C0.173908 13.6956 0.107299 13.425 0.250345 13.1445C0.385202 12.8783 0.61233 12.7739 0.905521 12.7744C2.30396 12.777 3.70239 12.777 5.10083 12.7744L6.73713 12.7755Z"
        fill={ass ? color : '#B5B5B5'}
      />
    </svg>
  );
}
