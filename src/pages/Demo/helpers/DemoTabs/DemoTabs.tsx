import type { FC } from 'react';
import { DEMO_TAB_ORDER } from '../../Demo.const';
import type { DemoTabsProps } from '../../Demo.types';

export const DemoTabs: FC<DemoTabsProps> = (props) => {
  const { active, labels, onSelect } = props;
  return (
    <div className="Bl-demo-tabs">
      {DEMO_TAB_ORDER.map((id) => {
        const tabClass = id === active ? 'Bl-demo-tabs__tab is-active' : 'Bl-demo-tabs__tab';
        return (
          <button key={id} type="button" className={tabClass} onClick={() => onSelect(id)}>
            {labels[id]}
          </button>
        );
      })}
    </div>
  );
};
