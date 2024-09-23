export interface SuggestedPost {
  question: string;
  options: string[];
  postType: string;
  userCanAddOption: boolean;
  errorMessage: string | null;
}

export interface SuggestedPostsProps {
  afterSuggestions: string;
  promptResponse: string;
  promptSources: string[];
  title: String | null;
}

export interface PostArticlesCardProps {
  questStartData: any;
}
