export interface AnalyzeModalProps {
  handleClose: () => void;
  modalVisible: boolean;
  title: string;
  image: string;
  questStartData: any;
}

export type PostAnswer = {
  id: number;
  question: string;
};
