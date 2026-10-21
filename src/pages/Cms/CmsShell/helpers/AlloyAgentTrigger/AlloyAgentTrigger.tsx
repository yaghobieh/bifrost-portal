import { useRef, useState, type FC } from 'react';
import { Badge, BearIcons, Flex, Typography } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import {
  ALLOY_MODEL_LABEL,
  ALLOY_TRIGGER_CHIP_ICON_SIZE,
  ALLOY_TRIGGER_GAP,
  ALLOY_TRIGGER_ICON_SIZE,
  ALLOY_TRIGGER_STARTERS,
} from './AlloyAgentTrigger.const';
import type { AlloyAgentTriggerProps } from './AlloyAgentTrigger.types';

export const AlloyAgentTrigger: FC<AlloyAgentTriggerProps> = ({
  onOpen,
  onSelectPrompt,
  className = '',
}) => {
  const { t } = useI18n();
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  const handleChipClick = (prompt: string) => {
    setIsHovered(false);
    if (onSelectPrompt) {
      onSelectPrompt(prompt);
    }
    onOpen();
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => {
          setIsHovered(false);
          onOpen();
        }}
        className="flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-900 to-[#1e3a8a] text-white hover:from-blue-950 hover:to-[#172554] shadow-xs hover:shadow-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]/40"
        aria-label={t.cmsShell.alloyAgentWithYou}
        title={t.cmsShell.alloyAgentWithYou}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
        </span>
        <BearIcons.SparklesIcon size={ALLOY_TRIGGER_ICON_SIZE} className="text-cyan-200" />
        <span className="whitespace-nowrap">{t.cmsShell.alloyAgentWithYou}</span>
      </button>

      {isHovered && (
        <div
          role="region"
          aria-label={t.cmsShell.alloyAgentWithYou}
          className="absolute right-0 top-full mt-2 w-80 rounded-xl bg-white dark:bg-gray-900 border border-blue-900/20 dark:border-blue-900/40 shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-800">
            <Flex align="center" gap={ALLOY_TRIGGER_GAP}>
              <span className="w-6 h-6 rounded-md bg-[#1e3a8a] text-white flex items-center justify-center">
                <BearIcons.SparklesIcon size={ALLOY_TRIGGER_ICON_SIZE} />
              </span>
              <div>
                <Typography variant="body2" className="text-xs font-bold text-gray-900 dark:text-white mb-0">
                  {t.cmsShell.alloyAgentWithYou}
                </Typography>
                <Typography variant="caption" className="text-[10px] text-gray-400 dark:text-gray-500 mb-0">
                  {t.cmsShell.alloyAgentSubtitle}
                </Typography>
              </div>
            </Flex>
            <Badge variant="info" className="text-[10px] bg-blue-50 text-blue-900 border border-blue-200 font-mono">
              {ALLOY_MODEL_LABEL}
            </Badge>
          </div>

          <div className="space-y-1.5 mb-3">
            <Typography variant="caption" className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Quick Creation:
            </Typography>
            {ALLOY_TRIGGER_STARTERS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleChipClick(prompt)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-900 dark:hover:text-blue-300 transition-colors flex items-center gap-2 group cursor-pointer border border-transparent hover:border-blue-200"
              >
                <BearIcons.SparklesIcon size={ALLOY_TRIGGER_CHIP_ICON_SIZE} className="text-[#1e3a8a] shrink-0" />
                <span className="truncate">{prompt}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsHovered(false);
              onOpen();
            }}
            className="w-full py-1.5 px-3 rounded-lg bg-[#1e3a8a] hover:bg-[#172554] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <span>{t.cmsShell.alloyAgentLaunch}</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
};
