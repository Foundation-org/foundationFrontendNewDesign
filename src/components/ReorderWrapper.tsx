import * as React from 'react';

interface ReorderIconProps {
  dragControls: any;
  delay: number;
  children: React.ReactNode;
}

export const ReorderWrapper = ({ dragControls, delay, children }: ReorderIconProps) => {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handlePointerDown = (event: React.PointerEvent) => {
    // event.persist();
    // timeoutRef.current = setTimeout(() => {
    //   dragControls.start(event);
    // }, delay * 1000);
  };

  const handlePointerUp = () => {
    // if (timeoutRef.current) {
    //   clearTimeout(timeoutRef.current);
    //   timeoutRef.current = null;
    // }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ cursor: 'grab' }}
    >
      {children}
    </div>
  );
};
