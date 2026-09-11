import React from 'react';

const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-surface-subtle/50 rounded-xl ${className}`}></div>
  );
};

export default Skeleton;
