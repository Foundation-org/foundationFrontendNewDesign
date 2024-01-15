import { useEffect, useState } from "react";
import { getQuestionTitle } from "../../utils/questionCard/SingleQuestCard";
import CardTopbar from "./CardTopbar";
import QuestBottombar from "./QuestBottombar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBookmark,
  deleteBookmarkById,
} from "../../services/api/homepageApis";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import BookmarkIcon from "../../pages/Dashboard/pages/QuestStartSection/components/BookmarkIcon";

const QuestCardLayout = ({
  questStartData,
  isBookmarked,
  handleStartTest,
  children,
}) => {
  const queryClient = useQueryClient();
  const persistedTheme = useSelector((state) => state.utils.theme);
  const [bookmarkStatus, setbookmarkStatus] = useState(false);

  useEffect(() => {
    setbookmarkStatus(isBookmarked);
  }, [isBookmarked]);

  const { mutateAsync: AddBookmark } = useMutation({
    mutationFn: createBookmark,
    onSuccess: (resp) => {
      toast.success("Bookmarked Added");
      queryClient.invalidateQueries("FeedData");
      handleStartTest(null);
    },
    onError: (err) => {
      toast.error(err.response.data.message.split(":")[1]);
    },
  });

  const { mutateAsync: DelBookmark } = useMutation({
    mutationFn: deleteBookmarkById,
    onSuccess: (resp) => {
      toast.success("Bookmark Removed ");
      if (!isBookmarkTab) {
        queryClient.invalidateQueries("FeedData");
      }
      handleStartTest(null);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const handleBookmark = () => {
    setbookmarkStatus((prevIsBookmarked) => !prevIsBookmarked);
    if (bookmarkStatus) {
      const params = {
        questForeignKey: questStartData._id,
      };
      DelBookmark(params);
    } else {
      const params = {
        questForeignKey: questStartData._id,
        Question: questStartData.Question,
        whichTypeQuestion: questStartData.whichTypeQuestion,
      };
      AddBookmark(params);
    }
  };

  return (
    <div className="rounded-[12.3px] border-2 border-[#D9D9D9] bg-[#F3F3F3] tablet:rounded-[15px] dark:border-white dark:bg-[#141618]">
      <CardTopbar
        QuestTopic={questStartData.QuestTopic}
        img={"assets/svgs/dashboard/badge.svg"}
        alt={"badge"}
        badgeCount={5}
        createdBy={questStartData.uuid}
      />
      <div className="pb-5 pt-[0.94rem]">
        <div className="ml-[1.39rem] mr-[0.62rem] flex items-center justify-between tablet:ml-[3.25rem] tablet:mr-[1.3rem] laptop:ml-[3.67rem]">
          <h4 className="text-[0.75rem] font-semibold text-[#7C7C7C] tablet:text-[1.25rem]">
            {questStartData.Question?.endsWith("?") ? "Q." : "S."}{" "}
            {questStartData.Question}
          </h4>
          <BookmarkIcon
            bookmarkStatus={bookmarkStatus}
            persistedTheme={persistedTheme}
            handleBookmark={handleBookmark}
          />
        </div>
        {children}
      </div>
      <QuestBottombar
        time={questStartData.createdAt}
        id={questStartData._id}
        createdBy={questStartData.uuid}
        title={getQuestionTitle(questStartData.whichTypeQuestion)}
        question={questStartData.Question}
        img={"assets/svgs/dashboard/badge.svg"}
        alt={"badge"}
        badgeCount={5}
      />
    </div>
  );
};

export default QuestCardLayout;
