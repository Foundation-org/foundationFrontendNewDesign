import { Outlet } from 'react-router-dom';
import Topbar from './components/Topbar';
import SidebarLeft from './components/SidebarLeft';
import { useEffect, useState } from 'react';

import * as QuestServices from '../../services/queries/quest';
import * as prefActions from '../../features/preferences/prefSlice';
import { initialColumns } from '../../constants/preferences';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  // preferences start
  const [columns, setColumns] = useState(initialColumns);
  const getPreferences = useSelector(prefActions.getPrefs);
  const { data: topicsData, isSuccess } = QuestServices.useGetAllTopics();

  const { data: prefSearchRes } = QuestServices.useSearchTopics(getPreferences);

  useEffect(() => {
    if (prefSearchRes?.length !== 0) {
      setColumns((prevColumns) => {
        const newList = prefSearchRes?.data.data || [];

        const filteredList = newList.filter(
          (item) => !prevColumns.Block.list.includes(item) && !prevColumns.Preferences.list.includes(item),
        );

        return {
          ...prevColumns,
          All: {
            ...prevColumns.All,
            list: filteredList || [],
          },
        };
      });
    } else {
      if (isSuccess) {
        setColumns((prevColumns) => {
          const newList = topicsData?.data.data || [];

          const filteredList = newList.filter(
            (item) => !prevColumns.Block.list.includes(item) && !prevColumns.Preferences.list.includes(item),
          );

          return {
            ...prevColumns,
            All: {
              ...prevColumns.All,
              list: filteredList || [],
            },
          };
        });
      }
    }
  }, [topicsData, prefSearchRes]);
  // preferences end

  return (
    <>
      <Topbar />
      <SidebarLeft columns={columns} setColumns={setColumns} />
      <div className="flex h-[calc(100vh-183.8px)] justify-between">
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;
