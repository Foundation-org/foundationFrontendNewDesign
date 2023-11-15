export const columns = [
  {
    name: 'txUserAction',
    selector: (row) => row.txUserAction,
  },
  {
    name: 'txID',
    selector: (row) => row.txID,
  },
  {
    name: 'txAuth',
    selector: (row) => row.txAuth,
  },
  {
    name: 'txFrom',
    selector: (row) => row.txFrom,
  },
  {
    name: 'txTo',
    selector: (row) => row.txTo,
  },
  {
    name: 'txAmount',
    selector: (row) => row.txAmount,
  },
  {
    name: 'txData',
    selector: (row) => row.txData,
  },
  {
    name: 'txDate',
    selector: (row) => row.txDate,
  },
  {
    name: 'txDescription',
    selector: (row) => row.txDescription,
  },
];

export const tableCustomStyles = {
  headRow: {
    style: {
      color: '#B5B7C0',
      fontSize: '16.128px',
      fontStyle: 'normal',
      fontWeight: '500',
      lineHeight: 'normal',
      letterSpacing: '-0.161px',
      border: '1px solid #EEE',
    },
  },
  rows: {
    style: {
      color: '#292D32',
      fontSize: '13.824px',
      fontStyle: 'normal',
      fontWeight: '500',
      lineHeight: 'normal',
      letterSpacing: '-0.138px',
    },
  },
};
