export const columns = [
  {
    name: "txUserAction",
    selector: (row) => row.txUserAction,
  },
  {
    name: "txID",
    selector: (row) => row.txID,
    width: "240px",
  },
  {
    name: "txAuth",
    selector: (row) => row.txAuth,
    width: "110px",
  },
  {
    name: "txFrom",
    selector: (row) => row.txFrom,
    width: "240px",
  },
  {
    name: "txTo",
    selector: (row) => capitalize(row.txTo),
    width: "110px",
  },
  {
    name: "txAmount",
    selector: (row) => row.txAmount,
    width: "150px",
  },
  {
    name: "txDate",
    selector: (row) => formatDate(row.txDate),
  },
  // {
  //   name: "txDescription",
  //   selector: (row) => row.txDescription,
  //   width: "450px",
  // },
];
function capitalize(str) {
  // Check if the input is a string
  if (typeof str !== "string") {
    return str;
  }
  return str.toUpperCase();
}
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric"};
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
