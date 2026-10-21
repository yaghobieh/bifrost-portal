import type { InkEditorProps, ToolbarOption, InkCommentThread, InkTrackChange } from '@forgedevstack/ink';

import type { Messages } from '../i18n/types';

export type DocsBlock =
  | { type: 'p'; text: string }
  | { type: 'code'; code: string; language?: 'tsx' | 'html' | 'json' | 'bash' | 'typescript' }
  | { type: 'html'; html: string }
  | { type: 'steps'; title?: string; items: { title: string; body: string }[] }
  | DocDemoBlock
  | { type: 'payload'; label: string; data: unknown };

export interface DocDemoEditorConfig {
  toolbar?: ToolbarOption[];
  features?: InkEditorProps['features'];
  variant?: InkEditorProps['variant'];
  keepInMemory?: boolean;
  memoryKey?: string;
  trackChangesEnabled?: boolean;
  trackChanges?: InkTrackChange[];
  comments?: InkCommentThread[];
  showCommentsPanel?: boolean;
  ai?: InkEditorProps['ai'];
  typoAutoFix?: boolean;
  showCharCount?: boolean;
  author?: string;
  tableRows?: number;
  tableCols?: number;
  placeholder?: string;
  minHeight?: number;
  slashCommands?: boolean;
}

export interface DocDemoBlock {
  type: 'demo';
  id: string;
  title?: string;
  description?: string;
  initialHtml: string;
  code: string;
  editor?: DocDemoEditorConfig;
  payload?: { label: string; data: unknown };
  showLiveHtml?: boolean;
}

export interface DocsPageContent {
  id: string;
  labelKey: keyof Messages['docs'];
  blocks: DocsBlock[];
}
