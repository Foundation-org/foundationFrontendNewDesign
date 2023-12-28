import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { GrClose } from "react-icons/gr";

const TopicPreferences = ({ topicSearch, setTopicSearch }) => {
  const initialColumns = {
    todo: {
      id: "todo",
      list: ["item 1", "item 2", "item 3", "item 4", "item 5"],
    },
    doing: {
      id: "doing",
      list: [],
    },
    done: {
      id: "done",
      list: [],
    },
  };

  const [columns, setColumns] = useState(initialColumns);

  const handleSearch = (e) => {
    setTopicSearch(e.target.value);
  };

  const onDragEnd = ({ source, destination }) => {
    // Make sure we have a valid destination
    if (destination === undefined || destination === null) return null;

    // Make sure we're actually moving the item
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    )
      return null;

    // Set start and end variables
    const start = columns[source.droppableId];
    const end = columns[destination.droppableId];

    // If start is the same as end, we're in the same column
    if (start === end) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = start.list.filter((_, idx) => idx !== source.index);

      // Then insert the item at the right location
      newList.splice(destination.index, 0, start.list[source.index]);

      // Then create a new copy of the column object
      const newCol = {
        id: start.id,
        list: newList,
      };

      // Update the state
      setColumns((state) => ({ ...state, [newCol.id]: newCol }));
      return null;
    } else {
      // If start is different from end, we need to update multiple columns
      // Filter the start list like before
      const newStartList = start.list.filter((_, idx) => idx !== source.index);

      // Create a new start column
      const newStartCol = {
        id: start.id,
        list: newStartList,
      };

      // Make a new end list array
      const newEndList = end.list;

      // Insert the item into the end list
      newEndList.splice(destination.index, 0, start.list[source.index]);

      // Create a new end column
      const newEndCol = {
        id: end.id,
        list: newEndList,
      };

      // Update the state
      setColumns((state) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      }));
      return null;
    }
  };

  return (
    <div className="w-[80%] py-[2.94rem]">
      <div className="mx-auto flex max-w-[80%] gap-7">
        <h1 className="text-[2.18rem] font-medium leading-normal text-[#535353]">
          Topic
        </h1>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search here...."
            className="h-[25px] w-full min-w-[215px] rounded-[8px] border-[1px] border-white bg-[#F6F6F6] px-3 text-[8.4px] text-gray-400 focus:outline-none dark:border-[#989898] dark:bg-[#000] dark:text-[#E8E8E8] tablet:h-[50.7px] tablet:text-[17.13px]"
            value={topicSearch}
            onChange={handleSearch}
          />
          {topicSearch && (
            <button
              className="absolute right-3 top-[9px]"
              onClick={() => {
                setTopicSearch("");
              }}
            >
              <GrClose className="h-3 w-3 text-black dark:text-white" />
            </button>
          )}
          {!topicSearch && (
            <img
              src="/assets/svgs/dashboard/search.svg"
              alt="search"
              className="absolute right-[12px] top-[9px] h-3 w-3 tablet:top-3 tablet:h-[26.4px] tablet:w-[24.3px]"
            />
          )}
        </div>
      </div>
      {/* columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-[1.44rem]">
          {Object.values(columns).map((col) => (
            <Droppable droppableId={col.id}>
              {(provided) => (
                <div className="flex flex-col px-6 py-4">
                  <h2>{col.id}</h2>
                  <div
                    className="mt-2 flex flex-grow flex-col rounded-[8px] bg-[#ddd] p-4"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {col.list.map((text, index) => (
                      <Draggable draggableId={text} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mt-2 rounded-[4px] bg-[#eee] px-1 py-2"
                          >
                            {text}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TopicPreferences;
