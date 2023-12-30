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
    <div className="w-full px-[2.75rem] py-[2.94rem]">
      <div className="mx-auto flex max-w-[80%] items-center gap-7">
        <h1 className="text-[2.18rem] font-medium leading-normal text-[#535353]">
          Topic
        </h1>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search here...."
            className="h-[25px] w-full min-w-[215px] rounded-[8px] border-[1px] border-white bg-[#F3F3F3] px-3 text-[8.4px] text-gray-400 focus:outline-none dark:border-[#989898] dark:bg-[#000] dark:text-[#E8E8E8] tablet:h-[80px] tablet:rounded-[26px] tablet:pl-[45px] tablet:pr-[60px] tablet:text-[26px]"
            value={topicSearch}
            onChange={handleSearch}
          />
          {topicSearch && (
            <button
              className="absolute right-3 top-[9px] tablet:top-1/2 tablet:-translate-x-1/2 tablet:-translate-y-1/2"
              onClick={() => {
                setTopicSearch("");
              }}
            >
              <GrClose className="h-3 w-3 text-[#C9C8C8] dark:text-white tablet:h-[27px] tablet:w-[27px]" />
            </button>
          )}
          {!topicSearch && (
            <img
              src="/assets/svgs/dashboard/search.svg"
              alt="search"
              className="absolute right-[12px] top-[9px] h-3 w-3 tablet:top-1/2 tablet:h-[26.4px] tablet:w-[24.3px] tablet:-translate-x-1/2 tablet:-translate-y-1/2"
            />
          )}
        </div>
      </div>
      {/* columns */}
      <div className="mt-[2.88rem]">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex justify-center gap-[1.44rem]">
            {Object.values(columns).map((col) => (
              <Droppable droppableId={col.id} key={col.id}>
                {(provided) => (
                  <div className="flex w-[19.125rem] flex-col">
                    <h2 className="flex h-[4.18rem] w-full items-center justify-center rounded-t-[20px] bg-[#F2F2F2] text-center text-[28px] font-semibold text-[#535353]">
                      {col.id}
                    </h2>
                    <div
                      className="custom-scrollbar flex h-[54vh] flex-col gap-[0.94rem] overflow-y-auto rounded-[8px] bg-[#FCFCFD] py-[1.19rem] pl-[2.56rem]"
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
                                className="w-fit select-none rounded-[8px] border-[1px] border-[#435059] bg-[#FCFCFD] px-3 py-[6px] text-[26px] font-normal leading-normal text-[#435059]"
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
