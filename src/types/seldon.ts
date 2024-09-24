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
}

export interface PromptResponse {
  title: string;
  abstract: string;
  findings: string[];
  suggestions: Suggestions[];
}

export interface SuggestedPostsProps {
  promptResponse: PromptResponse;
  promptSources: string[];
}

export interface PostArticlesCardProps {
  questStartData: any;
}
