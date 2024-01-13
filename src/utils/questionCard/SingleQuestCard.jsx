export function getQuestionTitle(whichTypeQuestion) {
  switch (whichTypeQuestion) {
    case "agree/disagree":
      return "Agree/Disagree";
    case "like/dislike":
      return "Like/Dislike";
    case "multiple choice":
      return "Multiple Choice";
    case "ranked choice":
      return "Ranked Choice";
    case "yes/no":
      return "Yes/No";
    default:
      return null;
  }
}

export const getButtonColor = (startStatus) => {
  switch (startStatus) {
    case "completed":
      return "bg-[#4ABD71]";
    case "change answer":
      return "bg-[#FDD503]";
    default:
      return "bg-gradient-to-r from-[#6BA5CF] to-[#389CE3]";
  }
};