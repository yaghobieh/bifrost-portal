import { useState, type FC } from 'react';
import { BearIcons, Button, Flex, Modal, Typography } from '@forgedevstack/bear';
import { useI18n } from '@i18n/index';
import { NUMBER_SIX, NUMBER_EIGHT, NUMBER_TWELVE } from '@const/numbers.const';
import { BUILDER_COLORS, BUILDER_ICON_SIZE_SM } from '../../ContentTypeBuilder.const';
import { generateSchemaJson } from '../../ContentTypeBuilder.utils';
import type { SchemaPreviewDrawerProps } from '../../ContentTypeBuilder.types';

export const SchemaPreviewDrawer: FC<SchemaPreviewDrawerProps> = ({
  isOpen,
  onClose,
  selectedType,
}) => {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const jsonString = generateSchemaJson(selectedType);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedType.id}.schema.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${selectedType.name} — ${t.cmsContentTypeBuilder.schemaPreview}`}
      size="lg"
    >
      <Flex direction="column" gap={NUMBER_TWELVE}>
        <Flex align="center" justify="between">
          <Typography variant="caption" style={{ color: '#64748B' }}>
            Live Strapi-compatible JSON schema representation for headless querying
          </Typography>

          <Flex align="center" gap={NUMBER_EIGHT}>
            <Button size="xs" variant="outline" onClick={handleCopy}>
              <Flex align="center" gap={NUMBER_SIX}>
                <BearIcons.CopyIcon size={BUILDER_ICON_SIZE_SM} />
                <span>
                  {copied
                    ? t.cmsContentTypeBuilder.copied
                    : t.cmsContentTypeBuilder.copyJson}
                </span>
              </Flex>
            </Button>

            <Button size="xs" variant="outline" onClick={handleDownload}>
              <Flex align="center" gap={NUMBER_SIX}>
                <BearIcons.DownloadIcon size={BUILDER_ICON_SIZE_SM} />
                <span>{t.cmsContentTypeBuilder.download}</span>
              </Flex>
            </Button>
          </Flex>
        </Flex>

        <pre
          style={{
            margin: 0,
            padding: 16,
            borderRadius: 8,
            backgroundColor: '#0F172A',
            color: '#38BDF8',
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: '1.5',
            maxHeight: '460px',
            overflowY: 'auto',
            border: '1px solid #1E293B',
          }}
        >
          {jsonString}
        </pre>
      </Flex>

      <Flex
        align="center"
        justify="end"
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid #F1F5F9',
        }}
      >
        <Button size="sm" variant="outline" onClick={onClose}>
          {t.cmsContentTypeBuilder.closePreview}
        </Button>
      </Flex>
    </Modal>
  );
};
