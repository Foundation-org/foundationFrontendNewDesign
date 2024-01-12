import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";

import * as prefActions from "../../../../features/preferences/prefSlice";

// icons
import { GrClose } from "react-icons/gr";
import { useDispatch } from "react-redux";

const TopicPreferences = ({ columns, setColumns, handleClose }) => {
  const dispatch = useDispatch();
  const getPreferences = useSelector(prefActions.getPrefs);
  console.log({ getPreferences });
  const persistedTheme = useSelector((state) => state.utils.theme);

  const handleSearch = (e) => {
    dispatch(prefActions.setTopicSearch(e.target.value));
  };

  const onDragEnd = ({ source, destination }) => {
    if (destination === undefined || destination === null) return null;

    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null;

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

  return (
    <div className="relative h-full w-[90vw] px-[1.19rem] py-[1.5rem] tablet:w-[75vw] tablet:px-[2.75rem] tablet:py-[2.94rem]">
      <GrClose
        className="absolute right-3 top-3 cursor-pointer text-[12px] text-[#C9C8C8] tablet:h-[16px] tablet:w-[16px] laptop:right-5 laptop:top-5 dark:text-white"
        onClick={handleClose}
      />
      <div className="max-[100%] mx-auto flex items-center gap-2 tablet:gap-7 laptop:max-w-[80%]">
        <h1 className=" text-[1rem] font-medium leading-normal text-[#535353] tablet:text-[1.4rem] laptop:text-[2.18rem]">
          Topic
        </h1>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search here...."
            className="h-[25px] w-full min-w-[215px] rounded-[8px] border-[1px] border-white bg-[#F3F3F3] px-3 text-[8.4px] text-[#435059] focus:outline-none tablet:h-[38px] tablet:text-[18px] laptop:h-[80px] laptop:rounded-[26px] laptop:pl-[45px] laptop:pr-[60px] laptop:text-[26px] dark:border-[#989898] dark:bg-[#000] dark:text-[#E8E8E8]"
            value={getPreferences?.topicSearch}
            onChange={handleSearch}
          />
          {getPreferences?.topicSearch && (
            <button
              className="absolute right-3 top-[9px] laptop:top-1/2 laptop:-translate-x-1/2 laptop:-translate-y-1/2"
              onClick={() => {
                dispatch(prefActions.setTopicSearch(""));
              }}
            >
              <IoClose className="h-3 w-3 text-[#C9C8C8] laptop:h-[27px] laptop:w-[27px] dark:text-white" />
            </button>
          )}
          {!getPreferences?.topicSearch && (
            <img
              src="/assets/svgs/dashboard/search.svg"
              alt="search"
              className="absolute right-[12px] top-[9px] h-3 w-3 laptop:top-1/2 laptop:h-[26.4px] laptop:w-[24.3px] laptop:-translate-x-1/2 laptop:-translate-y-1/2"
            />
          )}
        </div>
      </div>
      <h1 className="mx-auto max-w-[90%] py-[1rem]  text-[10px] font-normal leading-normal text-[#707175] tablet:text-[1.2rem] laptop:max-w-[80%] laptop:py-[2.19rem] laptop:text-[1.625rem]">
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
                        col.id === "All" ? "rounded-t-[0.5rem]" : ""
                      } bg-[#F2F2F2] text-center text-[1rem] font-semibold text-[#535353] tablet:text-[1.4rem] laptop:rounded-t-[1.4rem] laptop:text-[1.75rem]`}
                    >
                      {col.id}
                    </h2>
                    <div className="h-full border-[6px] border-[#F2F2F2]  pr-1 laptop:rounded-b-[1.25rem]">
                      <div
                        className="custom-scrollbar flex h-[18vh] min-h-[19vh] flex-col gap-[0.4rem] overflow-y-auto bg-[#FCFCFD] px-[1.31rem] py-[0.44rem] tablet:gap-[0.6rem] tablet:py-[1.19rem] tablet:pl-[1.7rem] laptop:h-[55vh] laptop:gap-[0.94rem]"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {col.list?.length >= 1 ? (
                          col.list.map((text, index) => (
                            <Draggable
                              key={text}
                              draggableId={text}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`flex h-[2.78rem] items-center ${
                                    snapshot.isDragging ? "" : ""
                                  }`}
                                >
                                  <div
                                    className={`${
                                      snapshot.isDragging
                                        ? "border-[#5FA3D5]"
                                        : "dakr: border-[#DEE6F7]"
                                    } flex h-[19.7px] w-[0.6rem] min-w-[0.6rem] items-center justify-center rounded-s-[0.28rem] border-y-[0.847px] border-s-[0.847px] bg-[#DEE6F7] tablet:h-[1.78rem] tablet:min-w-[1rem] laptop:h-full laptop:w-[1.31rem] laptop:min-w-[1.31rem] laptop:rounded-s-[0.625rem]`}
                                  >
                                    {persistedTheme === "dark" ? (
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
                                        ? "border-[#5FA3D5] bg-[#F2F6FF]"
                                        : "border-[#ACACAC] bg-[#FCFCFD]"
                                    } w-fit select-none truncate rounded-r-[0.2rem] border-y-[0.847px] border-e-[0.847px] px-3 py-[3px] text-[0.6rem] font-normal leading-[1.22] text-[#435059] tablet:text-[1rem] laptop:rounded-r-[0.625rem] laptop:py-[6px] laptop:text-[1.6rem]`}
                                  >
                                    {text}
                                  </p>
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <p className="flex h-full justify-center pt-[14px] text-center text-[10px] font-normal text-[#C9C8C8] tablet:pt-16 tablet:text-[1.375rem]">
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
    </div>
  );
};

export default TopicPreferences;
