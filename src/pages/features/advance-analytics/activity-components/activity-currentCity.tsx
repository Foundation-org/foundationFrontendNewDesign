import { useEffect, useState } from 'react';
import { ActivityProps } from '../../../../types/advanceAnalytics';
import CustomCombobox from '../../../../components/ui/Combobox';
import api from '../../../../services/api/Axios';

export default function ActivityCurrentCity({ dispatch, type }: ActivityProps) {
  const [cities, setCities] = useState([]);
  const [selected, setSelected] = useState();
  const [query, setQuery] = useState('');

  const searchCities = async () => {
    try {
      const cities = await api.post(`search/searchCities/?name=${query}`);
      setCities(cities.data);
    } catch (err) {
      setCities([]);
    }
  };

  useEffect(() => {
    searchCities();
  }, [query]);

  useEffect(() => {
    if (selected !== '' && type === 'current-city') {
      dispatch({ type: 'SET_CURRENT_CITY', payload: selected });
    }
    if (selected !== '' && type === 'hometown') {
      dispatch({ type: 'SET_HOME_TOWN', payload: selected });
    }
  }, [selected]);

  return (
    <CustomCombobox
      items={cities}
      selected={selected}
      setSelected={setSelected}
      placeholder={type === 'current-city' ? 'Enter city here' : 'Enter Hometown here'}
      query={query}
      setQuery={setQuery}
      type={'city'}
      disabled={null}
      handleTab={null}
      id={null}
      isArrow={null}
      verification={null}
      verify={null}
      wordsCheck={null}
      key={null}
    />
  );
}
