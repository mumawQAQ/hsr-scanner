import { Link, useLocation } from 'react-router-dom';

import { cn } from '@/lib/utils';

type NavigationItemProps = {
  path: string;
  text: string;
};

export const NavigationItem = ({ path, text }: NavigationItemProps) => {
  const location = useLocation();

  return (
    <Link to={path} className="group relative flex items-center">
      <div
        className={cn(
          'absolute left-0 w-[4px] rounded-r-full bg-primary transition-all',
          location.pathname !== path && 'group-hover:h-[20px]',
          location.pathname === path ? 'h-[24px]' : 'h-[12px]'
        )}
      />
      <div
        className={cn(
          'flex items-center gap-2 rounded p-2 transition-all',
          location.pathname === path && 'font-semibold'
        )}
      >
        {text}
      </div>
    </Link>
  );
};
