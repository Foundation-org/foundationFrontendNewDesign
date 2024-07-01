import { useMotionValue, Reorder, useDragControls } from 'framer-motion';
import { useRaisedShadow } from './use-raised-shadow';
import { ReorderWrapper } from './ReorderWrapper';

interface Props {
  item: string;
}

export const Item = ({ item }: Props) => {
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);
  const dragControls = useDragControls();

  return (
    <ReorderWrapper dragControls={dragControls} delay={1}>
      <Reorder.Item
        value={item}
        id={item}
        style={{ boxShadow, y }}
        dragListener={false}
        dragControls={dragControls}
        className={`mb-[10px] flex w-full flex-shrink-0 items-center justify-between rounded-[10px] bg-white px-[18px] py-[15px]`}
      >
        <span>{item}</span>
      </Reorder.Item>
    </ReorderWrapper>
  );
};
