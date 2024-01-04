import { GrClose } from "react-icons/gr";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const TopicPreferences = ({
  topicSearch,
  setTopicSearch,
  columns,
  setColumns,
}) => {
  const handleSearch = (e) => {
    setTopicSearch(e.target.value);
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
    <div className="w-[90vw] px-[1.19rem] py-[1.5rem] tablet:w-[75vw] tablet:px-[2.75rem] tablet:py-[2.94rem]">
      <div className="max-[100%] mx-auto flex items-center gap-2 laptop:max-w-[80%]">
        <h1 className=" text-[1rem] font-medium leading-normal text-[#535353] tablet:text-[1.4rem] laptop:text-[2.18rem]">
          Topic
        </h1>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search here...."
            className="h-[25px] w-full min-w-[215px] rounded-[8px] border-[1px] border-white bg-[#F3F3F3] px-3 text-[8.4px] text-gray-400 focus:outline-none tablet:h-[32px] tablet:text-[18px] laptop:h-[80px] laptop:rounded-[26px] laptop:pl-[45px] laptop:pr-[60px] laptop:text-[26px] dark:border-[#989898] dark:bg-[#000] dark:text-[#E8E8E8]"
            value={topicSearch}
            onChange={handleSearch}
          />
          {topicSearch && (
            <button
              className="absolute right-3 top-[9px] laptop:top-1/2 laptop:-translate-x-1/2 laptop:-translate-y-1/2"
              onClick={() => {
                setTopicSearch("");
              }}
            >
              <GrClose className="h-3 w-3 text-[#C9C8C8] laptop:h-[27px] laptop:w-[27px] dark:text-white" />
            </button>
          )}
          {!topicSearch && (
            <img
              src="/assets/svgs/dashboard/search.svg"
              alt="search"
              className="absolute right-[12px] top-[9px] h-3 w-3 laptop:top-1/2 laptop:h-[26.4px] laptop:w-[24.3px] laptop:-translate-x-1/2 laptop:-translate-y-1/2"
            />
          )}
        </div>
      </div>
      {/* columns */}
      <div className="mt-4 laptop:mt-[2.88rem]">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col justify-center gap-0 laptop:flex-row laptop:gap-[1.44rem]">
            {Object.values(columns).map((col) => (
              <Droppable droppableId={col.id} key={col.id}>
                {(provided) => (
                  <div className="flex w-full flex-col laptop:w-[19.125rem]">
                    <h2
                      className={`flex h-[2rem] w-full items-center justify-center laptop:h-[4.18rem] ${
                        col.id === "All" ? "rounded-t-[0.5rem]" : ""
                      } bg-[#F2F2F2] text-center text-[1rem] font-semibold text-[#535353] laptop:rounded-t-[1.4rem] laptop:text-[1.75rem]`}
                    >
                      {col.id}
                    </h2>
                    <div
                      className="custom-scrollbar flex h-[17vh] flex-col gap-[0.4rem] overflow-y-auto rounded-[8px] bg-[#FCFCFD] px-[1.31rem] py-[0.44rem] tablet:py-[1.19rem] tablet:pl-[2.56rem] laptop:h-[54vh] laptop:gap-[0.94rem]"
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
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="w-fit select-none rounded-[0.2rem] border-[1px] border-[#435059] bg-[#FCFCFD] px-3 py-[3px] text-[0.6rem] font-normal leading-normal text-[#435059] tablet:text-[1rem] laptop:rounded-[8px] laptop:py-[6px] laptop:text-[1.6rem]"
                              >
                                {text}
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <p className="flex h-full items-center justify-center text-[1.375rem] font-normal text-[#C9C8C8]">
                          No Record Yet
                        </p>
                      )}
                      {provided.placeholder}
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
