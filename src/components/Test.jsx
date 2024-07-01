import { useState } from 'react';
import { Reorder } from 'framer-motion';
import { Item } from './Item';

const initialItems = ['🍅 Tomato', '🥒 Cucumber', '🧀 Cheese', '🥬 Lettuce', '🥦 Broccoli', '🍄 Mushroom', '🥜 Grain'];

export default function App() {
  const [items, setItems] = useState(initialItems);

  return (
    <div className="relative m-0 flex h-full w-full items-center justify-center bg-[#ffaa00] p-0">
      <Reorder.Group axis="y" onReorder={setItems} values={items} className="relative w-[300px]">
        {items.map((item) => (
          <Item key={item} item={item} />
        ))}
      </Reorder.Group>
    </div>
  );
}
