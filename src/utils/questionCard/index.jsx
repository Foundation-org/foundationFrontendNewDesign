import * as HomepageAPIs from '../../services/api/homepageApis';

export const applyFilters = (params, filterStates, columns) => {
  if (filterStates.filterBySort !== '') {
    params = { ...params, sort: filterStates.filterBySort };
  }

  if (filterStates.filterByType && filterStates.filterByType !== 'All') {
    params = { ...params, type: filterStates.filterByType.toLowerCase() };
  } else {
    params = { ...params, type: '' };
  }

  if (filterStates.filterByScope === 'Me') {
    params = { ...params, filter: true, sort: 'Newest First' };
  }

  // if (columns.Preferences.list.length !== 0) {
  //   params = { ...params, terms: columns.Preferences.list };
  // }

  if (columns.Block?.list?.length !== 0) {
    params = { ...params, blockedTerms: columns.Block?.list };
  }

  return params;
};

export const fetchDataByStatus = async (params, filterStates) => {
  switch (filterStates.filterByStatus) {
    case 'Not Participated':
      return await HomepageAPIs.getAllUnanswered(params);
    case 'Participated':
      return await HomepageAPIs.getAllAnswered(params);
    case 'Completed':
      return await HomepageAPIs.getAllCompleted(params);
    case 'Changeable':
      return await HomepageAPIs.getAllChangable(params);
    default:
      return await HomepageAPIs.getAllQuestsWithDefaultStatus(params);
  }
};
