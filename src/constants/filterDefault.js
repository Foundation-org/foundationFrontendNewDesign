export const filterDefault = {
    expandedView: localStorage.getItem('expandedView') === 'true' ? true : false,
    searchData: '',
    filterByStatus: '',
    filterByType: '',
    filterByScope: '',
    filterBySort: 'Newest First',
    columns: {
        All: {
            id: 'All',
            list: [],
        },
        Preferences: {
            id: 'Preferences',
            list: [],
        },
        Block: {
            id: 'Block',
            list: [],
        },
    },
    clearFilter: false,
}