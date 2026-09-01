import type { FC } from 'react';
import type { CmsBottomNavProps } from './CmsBottomNav.types';

export const CmsBottomNav: FC<CmsBottomNavProps> = (props) => {
  const { items, label } = props;
  return (
    <nav className="bifrost-cms__bottom-nav" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={
            item.active
              ? 'bifrost-cms__bottom-nav-item is-active'
              : 'bifrost-cms__bottom-nav-item'
          }
          onClick={item.onClick}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
