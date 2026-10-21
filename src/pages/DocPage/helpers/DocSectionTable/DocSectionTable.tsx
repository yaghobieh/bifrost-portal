import type { FC } from 'react';
import { WidgetGridTable } from '@components/WidgetGridTable';
import type { DocSectionTableProps } from './DocSectionTable.types';

export const DocSectionTable: FC<DocSectionTableProps> = (props) => {
  const { table } = props;
  return <WidgetGridTable table={table} className="Bp-doc-table" />;
};
