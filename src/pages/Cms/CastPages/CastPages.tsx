import { useEffect, useState, type FC } from 'react';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { useNucleus } from '@forgedevstack/synapse';
import { BearIcons, Button, Card, Flex, Select, Typography } from '@forgedevstack/bear';
import { useAuth } from '@hooks/index';
import { useI18n } from '@i18n/index';
import { ROUTES } from '@const/index';
import { CMS_ICON_SIZE } from '@const/numbers.const';
import { authNucleus, contentNucleus } from '@sdk/index';
import { saveContentRequest } from '@sdk/modules/content';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import { useCmsLive } from '../CmsShell/CmsLiveProvider';
import { currentLiveLocation } from '../CmsShell/CmsLive.utils';
import { isPageSubmitLocked, locationOwner } from '../CmsShell/helpers/LiveEditors';
import { DOCUMENT_DEFAULT_LOCALE } from '../ContentPages/ContentPages.const';
import { isCastInstalled } from '../ExtensionsPages';
import {
  CAST_COLLECTION,
  CAST_FIELD_EMPTY,
  CAST_FIELD_TYPE,
  CAST_NONE,
  CAST_SLUG_PREFIX,
} from './CastPages.const';
import { CastForm } from './CastForm';
import type { CastField } from './CastPages.types';
import {
  createCastField,
  fieldsFromPayload,
  isCastFieldType,
  withCastPayload,
} from './CastPages.utils';

export const CastPages: FC = () => {
  const { t } = useI18n();
  const { navigate } = useNavigate();
  const { token: providerToken } = useAuth();
  const { onlineUsers, selfId } = useCmsLive();
  const { token } = useNucleus(authNucleus);
  const { items, fetchContent } = useNucleus(contentNucleus);
  const activeToken = token || providerToken;
  const installed = isCastInstalled();
  const [title, setTitle] = useState(CAST_FIELD_EMPTY);
  const [fields, setFields] = useState<CastField[]>([]);
  const [targetId, setTargetId] = useState(CAST_NONE);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (activeToken) {
      void fetchContent(activeToken);
    }
  }, [activeToken, fetchContent]);

  const groups = items.filter((item) => item.collection === CAST_COLLECTION);
  const liveLocation = currentLiveLocation().location;
  const pageLocked = isPageSubmitLocked({
    users: onlineUsers,
    currentUserId: selfId,
    location: liveLocation,
  });
  const pageOwner = locationOwner({ users: onlineUsers, location: liveLocation });
  const lockedHint =
    pageLocked && pageOwner ? t.cmsShell.pageLocked.replace('{name}', pageOwner.name) : CAST_NONE;
  const targetOptions = [
    { value: CAST_NONE, label: t.cmsCast.newGroup },
    ...groups.map((item) => ({
      value: item.id,
      label: item.title || item.slug,
    })),
  ];
  const typeOptions = [
    { value: CAST_FIELD_TYPE.TEXT, label: t.cmsCast.typeText },
    { value: CAST_FIELD_TYPE.TEXTAREA, label: t.cmsCast.typeTextarea },
    { value: CAST_FIELD_TYPE.NUMBER, label: t.cmsCast.typeNumber },
    { value: CAST_FIELD_TYPE.EMAIL, label: t.cmsCast.typeEmail },
    { value: CAST_FIELD_TYPE.IMAGE, label: t.cmsCast.typeImage },
    { value: CAST_FIELD_TYPE.RICH, label: t.cmsCast.typeRich },
    { value: CAST_FIELD_TYPE.FILE, label: t.cmsCast.typeFile },
    { value: CAST_FIELD_TYPE.BACKGROUND, label: t.cmsCast.typeBackground },
    { value: CAST_FIELD_TYPE.SELECT, label: t.cmsCast.typeSelect },
  ];

  const onTargetChange = (value: string) => {
    setTargetId(value);
    setSaved(false);
    if (!value) {
      setTitle(CAST_FIELD_EMPTY);
      setFields([]);
      return;
    }
    const item = items.find((entry) => entry.id === value);
    if (!item) return;
    setTitle(item.title);
    setFields(fieldsFromPayload(item.payload));
  };

  const onAddField = () => {
    setFields((current) => [...current, createCastField()]);
    setSaved(false);
  };

  const onFieldChange = (fieldId: string, patch: Partial<CastField>) => {
    setFields((current) =>
      current.map((field) => (field.id === fieldId ? { ...field, ...patch } : field)),
    );
    setSaved(false);
  };

  const onRemoveField = (fieldId: string) => {
    setFields((current) => current.filter((field) => field.id !== fieldId));
    setSaved(false);
  };

  const onSave = async (nextTitle: string) => {
    if (!activeToken) return;
    if (pageLocked) return;
    const resolvedTitle = nextTitle.trim();
    if (!resolvedTitle) return;
    const existing = items.find((entry) => entry.id === targetId);
    const item = await saveContentRequest(activeToken, {
      collection: CAST_COLLECTION,
      slug: existing?.slug || `${CAST_SLUG_PREFIX}${Date.now()}`,
      locale: existing?.locale || DOCUMENT_DEFAULT_LOCALE,
      title: resolvedTitle,
      status: existing?.status || 'draft',
      payload: withCastPayload(fields),
    });
    if (!item) return;
    await fetchContent(activeToken);
    setTargetId(item.id);
    setTitle(resolvedTitle);
    setSaved(true);
  };

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.CAST}>
      <Flex direction="column" gap={6}>
        <CmsPageHeader title={t.cmsCast.title} subtitle={t.cmsCast.subtitle} />
        {!installed ? (
          <Card padding="md">
            <Typography variant="h4" className="mb-2">
              {t.cmsCast.lockedTitle}
            </Typography>
            <Typography variant="body2" className="mb-3">
              {t.cmsCast.lockedBody}
            </Typography>
            <Button
              size="sm"
              variant="primary"
              icon={<BearIcons.PackageIcon size={CMS_ICON_SIZE} />}
              onClick={() => navigate(ROUTES.CMS_EXTENSIONS)}
            >
              {t.cmsCast.openStore}
            </Button>
          </Card>
        ) : (
          <div className="bifrost-cms-cast">
            <Card padding="md">
              <Typography variant="h4" className="mb-2">
                {t.cmsCast.groups}
              </Typography>
              <Select
                id="bifrost-cms-cast-group"
                label={t.cmsCast.groupLabel}
                options={targetOptions}
                value={targetId}
                onChange={onTargetChange}
              />
            </Card>
            <Card padding="md">
              <CastForm
                formKey={targetId || 'new'}
                initialTitle={title}
                fields={fields}
                typeOptions={typeOptions}
                saved={saved}
                onTitleChange={(value) => {
                  setTitle(value);
                  setSaved(false);
                }}
                onFieldChange={onFieldChange}
                onAddField={onAddField}
                onRemoveField={onRemoveField}
                onSave={onSave}
                submitLocked={pageLocked}
                lockedHint={lockedHint}
              />
            </Card>
          </div>
        )}
      </Flex>
    </CmsShell>
  );
};
