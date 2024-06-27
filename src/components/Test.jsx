import { useState } from 'react';
import { Reorder } from 'framer-motion';

const initialItems = ['🍅 Tomato', '🥒 Cucumber', '🧀 Cheese', '🥬 Lettuce'];

const Test = () => {
  const [items, setItems] = useState(initialItems);

  return (
    <div className="m-0 flex h-full w-full items-center justify-center overflow-hidden bg-[#ffaa00] p-0">
      <Reorder.Group axis="y" onReorder={setItems} values={items} className="relative w-[300px]">
        {items.map((item) => (
          <Reorder.Item
            key={item}
            value={item}
            id={item}
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
