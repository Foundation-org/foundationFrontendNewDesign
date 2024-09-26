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
  source: string[];
  title: string;
  updatedAt: string;
  userUuid: string;
  suggestion: suggestions[];
  __v: number;
}

export interface NewsFeedPropsType {
  data: articleType;
  innerRef: any;
}
