import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import * as prefActions from '../../../../features/preferences/prefSlice';

// icons
import { IoClose } from 'react-icons/io5';
import { GrClose } from 'react-icons/gr';
import Cross from '../../../../assets/preferences/Cross';

const TopicPreferences = ({ columns, setColumns, handleClose, itemsWithCross, setItemsWithCross }) => {
  const dispatch = useDispatch();
  // const [columns, setColumns] = useState();
  const getPreferences = useSelector(prefActions.getPrefs);
  const persistedTheme = useSelector((state) => state.utils.theme);

  const handleSearch = (e) => {
    dispatch(prefActions.setTopicSearch(e.target.value));
  };

  const onDragEnd = ({ source, destination }) => {
    if (destination === undefined || destination === null) return null;

    if (source.droppableId === destination.droppableId && destination.index === source.index) return null;

    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];

    if (start === end) {
      const newList = start.list.filter((_, idx) => idx !== source.index);

      newList.splice(destination.index, 0, start.list[source.index]);

      const newCol = {
        id: start.id,
        list: newList,
      };

      setColumns((state) => ({ ...state, [newCol.id]: newCol }));
      return null;
    } else {
      const draggedItem = start.list[source.index];

      if (
        source.droppableId === 'All' &&
        (destination.droppableId === 'Preferences' || destination.droppableId === 'Block')
      ) {
        setItemsWithCross((prevItems) => [...prevItems, draggedItem]);
      }

      const newStartList = start.list.filter((_, idx) => idx !== source.index);

      const newStartCol = {
        id: start.id,
        list: newStartList,
      };

      const newEndList = end.list;

      newEndList.splice(destination.index, 0, start.list[source.index]);

      const newEndCol = {
        id: end.id,
        list: newEndList,
      };

      setColumns((state) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      }));
      return null;
    }
  };

  const handleRemoveItemFromList = (text, sourceColumnId) => {
    const updatedList = columns[sourceColumnId].list.filter((item) => item !== text);

    const updatedColumn = {
      ...columns[sourceColumnId],
      list: updatedList,
    };

    setColumns((prevColumns) => ({
      ...prevColumns,
      [sourceColumnId]: updatedColumn,
    }));

    if (sourceColumnId !== 'All') {
      setColumns((prevColumns) => ({
        ...prevColumns,
        All: {
          ...prevColumns.All,
          list: [...prevColumns.All.list, text],
        },
      }));
    }

    setItemsWithCross((prevItems) => prevItems.filter((item) => item !== text));
  };

  return (
    <div>
      <div className="bg-blue-gradiant flex gap-[18px] items-center justify-between py-1 tablet:py-2 px-[10px] tablet:px-6 rounded-t-[0.9375rem] tablet:rounded-t-[37px] drop-shadow-lg">
        <div className="flex gap-2 tablet:gap-[18px] items-center">
          <img
            src="/assets/preferences/preferencesLogo.png"
            alt="preferencesLogo"
            className="h-[24px] w-[24px] tablet:h-[50px] tablet:w-[50px]"
          />
          <p className="text-white text-[10px] tablet:text-[20px] font-medium">Preferences</p>
        </div>

        <div onClick={handleClose} className="cursor-pointer">
          <img src="/assets/preferences/close.png" alt="close" className="h-2 w-2 tablet:h-6 tablet:w-6" />
          {/* <Cross
            styles={
              'w-[0.8rem] text-white h-[0.8rem] tablet:w-5 tablet:h-5 laptop:w-[27px] laptop:h-[27px] absolute top-[0.38rem] right-[0.32rem] tablet:right-[18px] tablet:top-[15px] laptop:right-[1.28rem] laptop:top-[1.44rem] cursor-pointer'
            }
          /> */}
        </div>
      </div>
      <div className="relative h-full w-[90vw] px-[1.19rem] py-[12px] tablet:w-fit tablet:px-[35px] tablet:py-[25px] border-b-2 border-x-2 tablet:border-b-[6px] tablet:border-x-[6px] border-[#DEE6F7] dark:border-[#8B8B8B] rounded-b-[0.9375rem] tablet:rounded-b-[37px]">
        <div className="max-[100%] mx-auto flex items-center gap-2 tablet:gap-[12.6px] laptop:max-w-[80%]">
          <h1 className="text-[10px] tablet:text-[22px] font-medium leading-normal text-[#535353] dark:text-white">
            Topic
          </h1>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search here...."
              className="h-[25px] w-full min-w-[215px] rounded-[5px] border-[1px] tablet:border-[3px] border-[#DEE6F7] bg-white px-3 text-[8.4px] text-[#435059] focus:outline-none dark:border-[#151515] dark:bg-[#151515] dark:text-white tablet:h-[38px] tablet:text-[18px] laptop:h-[57px] laptop:rounded-[10px] laptop:pl-5 laptop:pr-[60px] laptop:text-[20px]"
              value={getPreferences?.topicSearch}
              onChange={handleSearch}
            />
            {getPreferences?.topicSearch && (
              <button
                className="absolute right-3 top-[9px] laptop:top-1/2 laptop:-translate-x-1/2 laptop:-translate-y-1/2"
                onClick={() => {
                  dispatch(prefActions.setTopicSearch(''));
                }}
              >
                <IoClose className="h-3 w-3 text-[#C9C8C8] dark:text-white laptop:h-[27px] laptop:w-[27px]" />
              </button>
            )}
            {!getPreferences?.topicSearch && (
              <img
                src="/assets/svgs/dashboard/search.svg"
                alt="search"
                className="absolute right-[12px] top-1/2 h-3 w-3 -translate-y-1/2 laptop:top-1/2 laptop:h-[26.4px] laptop:w-[24.3px] laptop:-translate-x-1/2 laptop:-translate-y-1/2"
              />
            )}
          </div>
        </div>
        <h1 className="py-2 text-center text-[7px] font-normal leading-normal text-[#707175] dark:text-white tablet:text-[1.2rem] laptop:py-[15px] laptop:text-[16px]">
          Drag and drop to set your preferences and blocks
        </h1>
        {/* columns */}
        <div className="h-full tablet:mt-0 laptop:h-[80%]">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col justify-center gap-0 laptop:h-full laptop:flex-row laptop:gap-[1.44rem]">
              {Object.values(columns).map((col) => (
                <Droppable droppableId={col.id} key={col.id}>
                  {(provided) => (
                    <div className="flex h-full w-full flex-col laptop:w-[19.125rem]">
                      <h2
                        className={`flex h-[2rem] w-full items-center justify-center laptop:h-[4.18rem] ${
                          col.id === 'All' ? 'rounded-t-[0.5rem]' : ''
                        } bg-[#DEE6F7] text-center text-[1rem] font-semibold text-[#535353] dark:bg-[#000] dark:text-white tablet:text-[1.4rem] laptop:rounded-t-[1.4rem] laptop:text-[1.75rem]`}
                      >
                        {col.id === 'Preferences' ? 'Show Only' : col.id}
                      </h2>
                      <div className="h-full border-b-[3px] border-x-[3px] tablet:border-b-[6px] tablet:border-x-[6px] border-[#DEE6F7] bg-[#FCFCFD] pr-1 dark:border-[#212121] dark:bg-[#212121] laptop:rounded-b-[1.25rem]">
                        <div
                          className="custom-scrollbar overflow-x-hidden flex h-[18vh] min-h-[19vh] flex-col gap-[0.4rem] overflow-y-auto bg-[#FCFCFD] px-[1.31rem] py-[0.44rem] dark:bg-[#212121] tablet:gap-[0.6rem] tablet:py-[1.19rem] tablet:pl-[1.7rem] laptop:h-[55vh] laptop:gap-[0.94rem]"
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          s
                        >
                          {col.list?.length >= 1 ? (
                            col.list.sort().map((text, index) => (
                              <Draggable key={text} draggableId={text} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`flex h-[19.7px] items-center tablet:h-[1.78rem] laptop:h-[2.78rem] ${
                                      snapshot.isDragging ? '' : ''
                                    }`}
                                  >
                                    <div
                                      className={`${
                                        snapshot.isDragging
                                          ? 'border-[#5FA3D5]'
                                          : 'border-[#DEE6F7] dark:border-[#282828]'
                                      } flex h-[19.7px] w-[0.6rem] min-w-[0.6rem] items-center justify-center rounded-s-[0.28rem] border-y-[0.847px] border-s-[0.847px] bg-[#DEE6F7] dark:bg-[#8E8E8E] tablet:h-[1.78rem] tablet:min-w-[1rem] laptop:h-full laptop:w-[1.31rem] laptop:min-w-[1.31rem] laptop:rounded-s-[0.625rem]`}
                                    >
                                      {persistedTheme === 'dark' ? (
                                        <img
                                          src="/assets/svgs/dashboard/six-dots-dark.svg"
                                          alt="six dots"
                                          className="h-2 tablet:h-3 laptop:h-auto"
                                        />
                                      ) : (
                                        <img
                                          src="/assets/svgs/dashboard/six-dots.svg"
                                          alt="six dots"
                                          className="h-2 tablet:h-3 laptop:h-auto"
                                        />
                                      )}
                                    </div>
                                    <p
                                      className={`${
                                        snapshot.isDragging
                                          ? 'border-[#5FA3D5] bg-[#F2F6FF]'
                                          : 'border-[#ACACAC] bg-[#FCFCFD] dark:bg-[#282828]'
                                      } flex h-[19.7px] w-fit select-none items-center gap-[5px] truncate rounded-r-[0.2rem] border-y-[0.847px] border-e-[0.847px] px-2 py-[3px] text-[0.6rem] font-normal leading-[1.22] text-[#435059] dark:text-white tablet:h-[28.47px] tablet:gap-4 tablet:px-3 tablet:text-[1rem] laptop:h-[2.78rem] laptop:rounded-r-[0.625rem] laptop:py-[6px] laptop:text-[18px]`}
                                    >
                                      {text}
                                      <GrClose
                                        className={`${
                                          itemsWithCross.includes(text) ? 'block' : 'hidden'
                                        } h-[9.4px] w-[9.4px] cursor-pointer text-[#C9C8C8] dark:text-white tablet:h-[16px] tablet:w-[16px] laptop:h-[20px] laptop:w-[20px]`}
                                        onClick={() => handleRemoveItemFromList(text, col.id)}
                                      />
                                    </p>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <p className="flex h-full justify-center pt-[14px] text-center text-[10px] font-normal text-[#C9C8C8] tablet:pt-16 tablet:text-[16px]">
                              Drag and drop here
                            </p>
                          )}
                          {provided.placeholder}
                        </div>
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>{' '}
    </div>
  );
};

export default TopicPreferences;
