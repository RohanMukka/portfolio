import React from 'react';

interface SkillBadgeProps {
  skill: string;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ skill }) => {
  return (
    <div className="flex items-center rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium leading-5 text-sky-300 ">
      {skill}
    </div>
  );
};
