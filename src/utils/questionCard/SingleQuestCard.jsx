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
