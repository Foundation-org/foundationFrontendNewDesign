import { useState, useRef, useEffect } from 'react';
import { Reorder } from 'framer-motion';

const initialItems = ['🍅 Tomato', '🥒 Cucumber', '🧀 Cheese', '🥬 Lettuce'];

function useDragDelay(delay) {
  const [isDragging, setIsDragging] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseUp = () => {
      clearTimeout(timeoutRef.current);
      setIsDragging(false);
    };

    window.addEventListener('pointerup', handleMouseUp);

    return () => {
      clearTimeout(timeoutRef.current);
      window.removeEventListener('pointerup', handleMouseUp);
    };
  }, []);

  const handleMouseDown = () => {
    timeoutRef.current = setTimeout(() => setIsDragging(true), delay * 1000);
  };

  return { isDragging, handleMouseDown };
}

const Test = () => {
  const [items, setItems] = useState(initialItems);
  const { isDragging, handleMouseDown } = useDragDelay(1);

  console.log('isDragging', isDragging);

  return (
    <div className="relative m-0 flex h-full w-full items-center justify-center bg-[#ffaa00] p-0">
      <Reorder.Group axis="y" onReorder={setItems} values={items} className="relative w-[300px]">
        {items.map((item) => (
          <Reorder.Item
            key={item}
            value={item}
            id={item}
            onPointerDown={handleMouseDown}
            className="mb-[10px] flex w-full flex-shrink-0 cursor-grab items-center justify-between rounded-[10px] bg-white px-[18px] py-[15px]"
          >
            <span>{item}</span>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );
};

export default Test;
