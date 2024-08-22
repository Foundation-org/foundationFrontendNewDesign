export const analyzeButtons = [
  {
    id: 1,
    title: 'Hide',
  },
  {
    id: 2,
    title: 'Badge Count',
  },
  {
    id: 3,
    title: 'Target',
  },
  {
    id: 4,
    title: 'Activity',
  },
];

export const comparisonOperators = [
  { id: 1, name: 'Greater than' },
  { id: 2, name: 'Less than' },
  { id: 3, name: 'Equal to' },
  { id: 4, name: 'Not equal to' },
];

export const dualOptionsMap: Record<'yes/no' | 'agree/disagree' | 'like/dislike', { id: number; name: string }[]> = {
  'yes/no': [
    { id: 1, name: 'Yes' },
    { id: 2, name: 'No' },
  ],
  'agree/disagree': [
    { id: 1, name: 'Agree' },
    { id: 2, name: 'Disagree' },
  ],
  'like/dislike': [
    { id: 1, name: 'Like' },
    { id: 2, name: 'Dislike' },
  ],
};
