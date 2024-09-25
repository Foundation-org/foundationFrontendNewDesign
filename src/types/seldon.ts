export interface SuggestedPost {
  question: string;
  options: string[];
  postType: string;
  userCanAddOption: boolean;
  errorMessage: string | null;
}

export interface Suggestions {
  statement: string;
  options: string[];
  _id:any
}
export interface findings{
  heading:String;
  content:String;
}
export interface PromptResponse {
  title: string;
  abstract: string;
  findings: findings[];
  suggestions: Suggestions[];
  articleId: any
}

export interface SuggestedPostsProps {
  promptResponse: PromptResponse;
  promptSources: string[];
  articleId?: any
  handleFormSubmit?:any
}

export interface PostArticlesCardProps {
  questStartData: any;
}
