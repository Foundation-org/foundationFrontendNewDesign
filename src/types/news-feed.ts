interface suggestions {
  options: string[];
  statement: string;
  _id: string;
}

interface articleType {
  prompt: string;
  _id: string;
  abstract: string;
  createdAt: string;
  deletedAt: string;
  isActive: boolean;
  groundBreakingFindings: [];
  source: string[];
  title: string;
  discussion: string;
  conclusion: string;
  updatedAt: string;
  userUuid: string;
  seoSummary: string;
  suggestions: suggestions[];
  settings: any
  __v: number;
}

export interface NewsFeedPropsType {
  data: articleType;
  innerRef: any;
}