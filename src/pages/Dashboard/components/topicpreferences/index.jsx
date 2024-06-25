// import { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

// import * as QuestServices from '../../../../services/queries/quest';
// import * as prefActions from '../../../../features/preferences/prefSlice';
// import { Button } from '../../../../components/ui/Button';
// // icons
// import { IoClose } from 'react-icons/io5';
// import { GrClose } from 'react-icons/gr';

// const TopicPreferences = ({ columns, setColumns, handleClose, itemsWithCross, setItemsWithCross }) => {
//   const dispatch = useDispatch();
//   const getPreferences = useSelector(prefActions.getPrefs);
//   const persistedTheme = useSelector((state) => state.utils.theme);

//   const { data: topicsData, isSuccess } = QuestServices.useGetAllTopics();
//   const { data: prefSearchRes } = QuestServices.useSearchTopics(getPreferences);

//   useEffect(() => {
//     if (prefSearchRes?.length !== 0) {
//       setColumns((prevColumns) => {
//         const newList = prefSearchRes?.data.data || [];
//         // const filteredList = newList.filter(
//         //   (item) => !prevColumns.Block.list.includes(item) && !prevColumns.Preferences.list.includes(item),
//         // );
//         const filteredList = newList.filter((item) => !prevColumns.Block.list.includes(item));

//         return {
//           ...prevColumns,
//           All: {
//             ...prevColumns.All,
//             list: filteredList || [],
//           },
//         };
//       });
//     } else {
//       if (isSuccess) {
//         setColumns((prevColumns) => {
//           const newList = topicsData?.data.data || [];
//           // const filteredList = newList.filter(
//           //   (item) => !prevColumns.Block.list.includes(item) && !prevColumns.Preferences.list.includes(item),
//           // );

//           const filteredList = newList.filter((item) => !prevColumns.Block.list.includes(item));

//           return {
//             ...prevColumns,
//             All: {
//               ...prevColumns.All,
//               list: filteredList || [],
//             },
//           };
//         });
//       }
//     }
//   }, [topicsData, prefSearchRes, isSuccess]);

//   const handleSearch = (e) => {
//     dispatch(prefActions.setTopicSearch(e.target.value));
//   };

//   const onDragEnd = ({ source, destination }) => {
//     if (destination === undefined || destination === null) return null;

//     if (source.droppableId === destination.droppableId && destination.index === source.index) return null;

//     const start = columns[source.droppableId];
//     const end = columns[destination.droppableId];

//     if (start === end) {
//       const newList = start.list.filter((_, idx) => idx !== source.index);

//       newList.splice(destination.index, 0, start.list[source.index]);

//       const newCol = {
//         id: start.id,
//         list: newList,
//       };

//       setColumns((state) => ({ ...state, [newCol.id]: newCol }));
//       return null;
//     } else {
//       const draggedItem = start.list[source.index];

//       if (
//         source.droppableId === 'All' &&
//         (destination.droppableId === 'Preferences' || destination.droppableId === 'Block')
//       ) {
//         setItemsWithCross((prevItems) => [...prevItems, draggedItem]);
//       }

//       const newStartList = start.list.filter((_, idx) => idx !== source.index);

//       const newStartCol = {
//         id: start.id,
//         list: newStartList,
//       };

//       const newEndList = end.list;

//       newEndList.splice(destination.index, 0, start.list[source.index]);

//       const newEndCol = {
//         id: end.id,
//         list: newEndList,
//       };

//       setColumns((state) => ({
//         ...state,
//         [newStartCol.id]: newStartCol,
//         [newEndCol.id]: newEndCol,
//       }));
//       return null;
//     }
//   };

//   const handleRemoveItemFromList = (text, sourceColumnId) => {
//     const updatedList = columns[sourceColumnId].list.filter((item) => item !== text);

//     const updatedColumn = {
//       ...columns[sourceColumnId],
//       list: updatedList,
//     };

//     setColumns((prevColumns) => ({
//       ...prevColumns,
//       [sourceColumnId]: updatedColumn,
//     }));

//     if (sourceColumnId !== 'All') {
//       setColumns((prevColumns) => ({
//         ...prevColumns,
//         All: {
//           ...prevColumns.All,
//           list: [...prevColumns.All.list, text],
//         },
//       }));
//     }

//     setItemsWithCross((prevItems) => prevItems.filter((item) => item !== text));
//   };

//   return (
//     <div>
//       <div className="bg-blue-gradiant flex items-center justify-between gap-[18px] rounded-t-[0.9375rem] px-[10px] py-1 drop-shadow-lg tablet:rounded-t-[37px] tablet:px-6 tablet:py-2">
//         <div className="flex items-center gap-2 tablet:gap-[18px]">
//           <img
//             src="/assets/preferences/preferencesLogo.png"
//             alt="preferencesLogo"
//             className="h-[24px] w-[24px] tablet:h-[50px] tablet:w-[50px]"
//           />
//           <p className="text-[10px] font-medium text-white tablet:text-[20px]">Topics</p>
//         </div>

//         <div className="cursor-pointer">
//           <img
//             src="/assets/preferences/close.png"
//             alt="close"
//             className="h-2 w-2 tablet:h-6 tablet:w-6"
//             onClick={handleClose}
//           />
//         </div>
//       </div>
//       <div className="relative h-full w-[90vw] rounded-b-[0.9375rem] border-x-2 border-b-2 border-[#DEE6F7] px-[1.19rem] py-[12px] tablet:w-fit tablet:rounded-b-[37px] tablet:border-x-[6px] tablet:border-b-[6px] tablet:px-[35px] tablet:py-[25px] dark:border-[#8B8B8B]">
//         <div className="max-[100%] mx-auto flex items-center gap-2 tablet:gap-[12.6px] laptop:max-w-[80%]">
//           <h1 className="text-[10px] font-medium leading-normal text-[#535353] tablet:text-[22px] dark:text-white">
//             Topic
//           </h1>
//           <div className="relative w-full">
//             <input
//               type="text"
//               placeholder="Search here...."
//               className="h-[25px] w-full min-w-[215px] rounded-[5px] border-[1px] border-[#DEE6F7] bg-white px-3 text-[8.4px] text-[#435059] focus:outline-none tablet:h-[38px] tablet:border-[3px] tablet:text-[18px] laptop:h-[57px] laptop:rounded-[10px] laptop:pl-5 laptop:pr-[60px] laptop:text-[20px] dark:border-[#151515] dark:bg-[#151515] dark:text-white"
//               value={getPreferences?.topicSearch}
//               onChange={handleSearch}
//             />
//             {getPreferences?.topicSearch && (
//               <button
//                 className="absolute right-3 top-[9px] laptop:top-1/2 laptop:-translate-x-1/2 laptop:-translate-y-1/2"
//                 onClick={() => {
//                   dispatch(prefActions.setTopicSearch(''));
//                 }}
//               >
//                 <IoClose className="h-3 w-3 text-[#C9C8C8] laptop:h-[27px] laptop:w-[27px] dark:text-white" />
//               </button>
//             )}
//             {!getPreferences?.topicSearch && (
//               <img
//                 src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/search.svg`}
//                 alt="search"
//                 className="absolute right-[12px] top-1/2 h-3 w-3 -translate-y-1/2 laptop:top-1/2 laptop:h-[26.4px] laptop:w-[24.3px] laptop:-translate-x-1/2 laptop:-translate-y-1/2"
//               />
//             )}
//           </div>
//         </div>
//         <h1 className="py-2 text-center text-[7px] font-normal leading-normal text-[#707175] tablet:text-[1.2rem] laptop:py-[15px] laptop:text-[16px] dark:text-white">
//           Drag and drop to hide the topics
//         </h1>
//         {/* columns */}
//         <div className="h-full tablet:mt-0 laptop:h-[80%]">
//           <DragDropContext onDragEnd={onDragEnd}>
//             <div className="flex flex-col justify-center gap-0 laptop:h-full laptop:flex-row laptop:gap-[1.44rem]">
//               {Object.values(columns).map((col) => (
//                 <Droppable droppableId={col.id} key={col.id}>
//                   {(provided) => (
//                     <div className="flex h-full w-full flex-col laptop:w-[19.125rem]">
//                       <h2
//                         className={`flex h-[2rem] w-full items-center justify-center laptop:h-[4.18rem] ${
//                           col.id === 'All' ? 'rounded-t-[0.5rem]' : ''
//                         } bg-[#DEE6F7] text-center text-[1rem] font-semibold text-[#535353] tablet:text-[1.4rem] laptop:rounded-t-[1.4rem] laptop:text-[1.75rem] dark:bg-[#000] dark:text-white`}
//                       >
//                         {col.id === 'Preferences' ? 'Show Only' : col.id === 'Block' ? 'Hide' : col.id}
//                       </h2>
//                       <div className="h-full border-x-[3px] border-b-[3px] border-[#DEE6F7] bg-[#FCFCFD] pr-1 tablet:border-x-[6px] tablet:border-b-[6px] laptop:rounded-b-[1.25rem] dark:border-[#212121] dark:bg-[#212121]">
//                         <div
//                           className="custom-scrollbar flex h-[25vh] min-h-[25vh] flex-col gap-[0.4rem] overflow-y-auto overflow-x-hidden bg-[#FCFCFD] px-[1.31rem] py-[0.44rem] tablet:gap-[0.6rem] tablet:py-[1.19rem] tablet:pl-[1.7rem] laptop:h-[55vh] laptop:gap-[0.94rem] dark:bg-[#212121]"
//                           {...provided.droppableProps}
//                           ref={provided.innerRef}
//                         >
//                           {col.list?.length >= 1 ? (
//                             col.list.sort().map((text, index) => (
//                               <Draggable key={text} draggableId={text} index={index}>
//                                 {(provided, snapshot) => (
//                                   <div
//                                     ref={provided.innerRef}
//                                     {...provided.draggableProps}
//                                     {...provided.dragHandleProps}
//                                     className={`flex h-[19.7px] w-fit items-center tablet:h-[1.78rem] laptop:h-[2.78rem] ${
//                                       snapshot.isDragging ? '' : ''
//                                     }`}
//                                   >
//                                     <div
//                                       className={`${
//                                         snapshot.isDragging
//                                           ? 'border-[#5FA3D5]'
//                                           : 'border-[#DEE6F7] dark:border-[#282828]'
//                                       } flex h-6 w-[0.7rem] min-w-[0.7rem] items-center justify-center rounded-s-[0.28rem] border-y-[0.847px] border-s-[0.847px] bg-[#DEE6F7] tablet:h-[1.78rem] tablet:min-w-[1rem] laptop:h-full laptop:w-[1.31rem] laptop:min-w-[1.31rem] laptop:rounded-s-[0.625rem] dark:bg-[#8E8E8E]`}
//                                     >
//                                       {persistedTheme === 'dark' ? (
//                                         <img
//                                           src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots-dark.svg`}
//                                           alt="six dots"
//                                           className="h-2 tablet:h-3 laptop:h-auto"
//                                         />
//                                       ) : (
//                                         <img
//                                           src={`${import.meta.env.VITE_S3_IMAGES_PATH}/assets/svgs/dashboard/six-dots.svg`}
//                                           alt="six dots"
//                                           className="h-2 tablet:h-3 laptop:h-auto"
//                                         />
//                                       )}
//                                     </div>
//                                     <p
//                                       className={`${
//                                         snapshot.isDragging
//                                           ? 'border-[#5FA3D5] bg-[#F2F6FF]'
//                                           : 'border-[#ACACAC] bg-[#FCFCFD] dark:bg-[#282828]'
//                                       } flex h-6 w-fit select-none items-center gap-3 truncate rounded-r-[0.2rem] border-y-[0.847px] border-e-[0.847px] px-2 py-[3px] text-[0.6rem] font-normal leading-[1.22] text-[#435059] tablet:h-[28.47px] tablet:gap-4 tablet:px-3 tablet:text-[1rem] laptop:h-[2.78rem] laptop:rounded-r-[0.625rem] laptop:py-[6px] laptop:text-[18px] dark:text-white`}
//                                     >
//                                       {text}
//                                       {col.id !== 'All' && (
//                                         <GrClose
//                                           className={`${
//                                             itemsWithCross?.includes(text) ? 'block' : 'hidden'
//                                           } h-3 w-3 cursor-pointer text-[#C9C8C8] tablet:h-[16px] tablet:w-[16px] laptop:h-[20px] laptop:w-[20px] dark:text-white`}
//                                           onClick={() => handleRemoveItemFromList(text, col.id)}
//                                         />
//                                       )}
//                                     </p>
//                                   </div>
//                                 )}
//                               </Draggable>
//                             ))
//                           ) : (
//                             <p className="flex h-full justify-center pt-[14px] text-center text-[10px] font-normal text-[#C9C8C8] tablet:pt-16 tablet:text-[16px]">
//                               Drag and drop here
//                             </p>
//                           )}
//                           {provided.placeholder}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </Droppable>
//               ))}
//             </div>
//           </DragDropContext>
//         </div>
//         <div className="mt-4 flex items-center justify-center">
//           <Button
//             variant={'submit'}
//             onClick={() => {
//               handleClose();
//             }}
//           >
//             Done
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopicPreferences;
