export const columns = [
  {
    accessorKey: "txUserAction",
    header: "txUserAction",
    cell: (props) => <p>{props.getValue()}</p>,
    size: 240,
    minSize: 40,
  },
  {
    accessorKey: "txID",
    header: "txID",
    cell: (props) => <p>{props.getValue()}</p>,
    size: 240,
    minSize: 40,
  },
  {
    accessorKey: "txAuth",
    header: "txAuth",
    cell: (props) => <p>{props.getValue()}</p>,
    size: 240,
    minSize: 40,
  },
  {
    accessorKey: "txFrom",
    header: "txFrom",
    cell: (props) => <p>{props.getValue()}</p>,
    size: 240,
    minSize: 40,
  },
  {
    accessorKey: "txTo",
    header: "txTo",
    cell: (props) => <p>{props.getValue()}</p>,
    size: 240,
    minSize: 40,
  },
  {
    accessorKey: "txAmount",
    header: "txAmount",
    cell: (props) => <p>{props.getValue()}</p>,
    size: 240,
    minSize: 40,
  },
];

// =================== old
function capitalize(str) {
  // Check if the input is a string
  if (typeof str !== "string") {
    return str;
  }
  return str.toUpperCase();
}
function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const formattedDate = new Date(dateString).toLocaleString(undefined, options);
  return formattedDate;
}

export const tableCustomStyles = {
  headRow: {
    style: {
      color: "#B5B7C0",
      fontSize: "23.358px",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "normal",
      letterSpacing: "-0.23px",
      border: "1px solid #EEE",
      height: "78px",
    },
  },
  rows: {
    style: {
      color: "#292D32",
      fontSize: "20.021px",
      fontStyle: "normal",
      fontWeight: "500",
      lineHeight: "normal",
      letterSpacing: "-0.2px",
      height: "78px",
    },
  },
};
