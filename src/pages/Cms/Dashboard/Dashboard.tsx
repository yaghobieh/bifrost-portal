import { useEffect, useState, type CSSProperties, type FC } from 'react';
import { useNucleus } from '@forgedevstack/synapse';
import { BearIcons, Badge, Button, Card, Flex, Progress, Spinner, Typography } from '@forgedevstack/bear';
import { useNavigate } from '@forgedevstack/forge-compass/react';
import { useAuth } from '@hooks/index';
import { useI18n } from '@i18n/index';
import { NUMBER_ZERO } from '@const/numbers.const';
import { CMS_KPI_ICON_SIZE, ROUTES } from '@const/index';
import { authNucleus, cmsNucleus } from '@sdk/index';
import { CmsShell, CMS_NAV_IDS, CmsPageHeader } from '../CmsShell';
import { loadOnboardingDone, saveOnboardingDone } from '@utils';
import { loadCmsSite } from '../SettingsPages';
import { CMS_NAV_ROUTES } from '../CmsShell/CmsShell.const';
import {
  CMS_KPI_TONES,
  CMS_PERCENT_BASE,
  FALLBACK_ANALYTICS,
  WEEKDAY_KEYS,
  barHeightPercent,
  formatNumber,
} from './Dashboard.const';

export const Dashboard: FC = () => {
  const { t } = useI18n();
  const { navigate } = useNavigate();
  const { token: providerToken } = useAuth();
  const { token } = useNucleus(authNucleus);
  const { analytics, loading } = useNucleus(cmsNucleus);
  const activeToken = token || providerToken;
  const [showOnboarding, setShowOnboarding] = useState(() => !loadOnboardingDone());
  const site = loadCmsSite();

  useEffect(() => {
    if (!activeToken) return;
    void cmsNucleus.get().fetchDashboard(activeToken);
  }, [activeToken]);

  const data = analytics ? { ...FALLBACK_ANALYTICS, ...analytics } : FALLBACK_ANALYTICS;
  const weeklyMax = Math.max(...data.weekly, NUMBER_ZERO);
  const weeklyTotal = data.weekly.reduce((sum, value) => sum + value, NUMBER_ZERO);
  const peakIndex = data.weekly.findIndex((value) => value === weeklyMax);
  const publishRate =
    data.documents > NUMBER_ZERO
      ? Math.round((data.published / data.documents) * CMS_PERCENT_BASE)
      : NUMBER_ZERO;
  const distributionTotal = data.distribution.reduce((sum, slice) => sum + slice.value, NUMBER_ZERO);
  const usagePercent =
    data.tokensLimit > NUMBER_ZERO
      ? (data.tokensUsed / data.tokensLimit) * CMS_PERCENT_BASE
      : NUMBER_ZERO;

  const onSkipTour = () => {
    saveOnboardingDone();
    setShowOnboarding(false);
  };

  const onOpenBuilder = () => {
    saveOnboardingDone();
    setShowOnboarding(false);
    navigate(CMS_NAV_ROUTES[CMS_NAV_IDS.BUILDER] || ROUTES.CMS_BUILDER);
  };

  return (
    <CmsShell activeNavId={CMS_NAV_IDS.DASHBOARD}>
      <Flex direction="column" gap={6} className="bifrost-cms-page">
        <CmsPageHeader title={t.dashboard.title} subtitle={t.dashboard.subtitle} />

        {showOnboarding ? (
          <Card variant="elevated" padding="md" className="bifrost-cms-onboarding-banner">
            <Flex justify="between" align="center" gap={3} className="bifrost-cms-onboarding-banner__row">
              <div>
                <Typography variant="h4" className="mb-1">
                  {t.cmsOnboarding.title}
                </Typography>
                <Typography variant="body2" className="bifrost-cms__muted mb-0">
                  {t.cmsOnboarding.body}
                </Typography>
              </div>
              <Flex gap={2}>
                <Button variant="primary" onClick={onOpenBuilder}>
                  {t.cmsOnboarding.step1Cta}
                </Button>
                <Button variant="outline" onClick={onSkipTour}>
                  {t.cmsOnboarding.skipTour}
                </Button>
              </Flex>
            </Flex>
          </Card>
        ) : null}

        {loading ? (
          <Flex align="center" gap={2}>
            <Spinner size="sm" />
            <Typography variant="body2" className="mb-0">
              {t.dashboard.loading}
            </Typography>
          </Flex>
        ) : null}

        <div className="bifrost-cms-stat-row">
          <Card padding="md" className={`bifrost-cms-stat bifrost-cms-stat--${CMS_KPI_TONES.PAGES}`}>
            <div className="bifrost-cms-stat__top">
              <span className="bifrost-cms-stat__label">{t.dashboard.documents}</span>
              <span className="bifrost-cms-stat__ic">
                <BearIcons.FileTextIcon size={CMS_KPI_ICON_SIZE} />
              </span>
            </div>
            <div className="bifrost-cms-stat__num">{formatNumber(data.documents)}</div>
          </Card>
          <Card padding="md" className={`bifrost-cms-stat bifrost-cms-stat--${CMS_KPI_TONES.PUBLISHED}`}>
            <div className="bifrost-cms-stat__top">
              <span className="bifrost-cms-stat__label">{t.dashboard.publishedCount}</span>
              <span className="bifrost-cms-stat__ic">
                <BearIcons.CheckIcon size={CMS_KPI_ICON_SIZE} />
              </span>
            </div>
            <div className="bifrost-cms-stat__num bifrost-cms-stat__num--success">
              {formatNumber(data.published)}
            </div>
          </Card>
          <Card padding="md" className={`bifrost-cms-stat bifrost-cms-stat--${CMS_KPI_TONES.DRAFTS}`}>
            <div className="bifrost-cms-stat__top">
              <span className="bifrost-cms-stat__label">{t.dashboard.drafts}</span>
              <span className="bifrost-cms-stat__ic">
                <BearIcons.EditIcon size={CMS_KPI_ICON_SIZE} />
              </span>
            </div>
            <div className="bifrost-cms-stat__num bifrost-cms-stat__num--warning">
              {formatNumber(data.drafts)}
            </div>
          </Card>
          <Card padding="md" className={`bifrost-cms-stat bifrost-cms-stat--${CMS_KPI_TONES.TEMPLATES}`}>
            <div className="bifrost-cms-stat__top">
              <span className="bifrost-cms-stat__label">{t.dashboard.templatesCount}</span>
              <span className="bifrost-cms-stat__ic">
                <BearIcons.LayersIcon size={CMS_KPI_ICON_SIZE} />
              </span>
            </div>
            <div className="bifrost-cms-stat__num">{formatNumber(data.templates)}</div>
          </Card>
          <Card padding="md" className={`bifrost-cms-stat bifrost-cms-stat--${CMS_KPI_TONES.MEDIA}`}>
            <div className="bifrost-cms-stat__top">
              <span className="bifrost-cms-stat__label">{t.dashboard.mediaCount}</span>
              <span className="bifrost-cms-stat__ic">
                <BearIcons.ImageIcon size={CMS_KPI_ICON_SIZE} />
              </span>
            </div>
            <div className="bifrost-cms-stat__num">{formatNumber(data.media)}</div>
          </Card>
          <Card padding="md" className={`bifrost-cms-stat bifrost-cms-stat--${CMS_KPI_TONES.TOKENS}`}>
            <div className="bifrost-cms-stat__top">
              <span className="bifrost-cms-stat__label">{t.dashboard.tokens}</span>
              <span className="bifrost-cms-stat__ic">
                <BearIcons.BarChartIcon size={CMS_KPI_ICON_SIZE} />
              </span>
            </div>
            <div className="bifrost-cms-stat__num">{formatNumber(data.tokensUsed)}</div>
          </Card>
          <Card padding="md" className={`bifrost-cms-stat bifrost-cms-stat--${CMS_KPI_TONES.TABLES}`}>
            <div className="bifrost-cms-stat__top">
              <span className="bifrost-cms-stat__label">{t.dashboard.tablesCount}</span>
              <span className="bifrost-cms-stat__ic">
                <BearIcons.DatabaseIcon size={CMS_KPI_ICON_SIZE} />
              </span>
            </div>
            <div className="bifrost-cms-stat__num">{formatNumber(data.tables)}</div>
          </Card>
          <Card padding="md" className={`bifrost-cms-stat bifrost-cms-stat--${CMS_KPI_TONES.CREW}`}>
            <div className="bifrost-cms-stat__top">
              <span className="bifrost-cms-stat__label">{t.dashboard.crewCount}</span>
              <span className="bifrost-cms-stat__ic">
                <BearIcons.UsersIcon size={CMS_KPI_ICON_SIZE} />
              </span>
            </div>
            <div className="bifrost-cms-stat__num">{formatNumber(data.crew)}</div>
          </Card>
          <Card padding="md" className={`bifrost-cms-stat bifrost-cms-stat--${CMS_KPI_TONES.ALERTS}`}>
            <div className="bifrost-cms-stat__top">
              <span className="bifrost-cms-stat__label">{t.dashboard.unreadAlerts}</span>
              <span className="bifrost-cms-stat__ic">
                <BearIcons.BellIcon size={CMS_KPI_ICON_SIZE} />
              </span>
            </div>
            <div className="bifrost-cms-stat__num">{formatNumber(data.unreadNotifications)}</div>
          </Card>
        </div>

        <div className="bifrost-cms-dash-row">
          <Card padding="md">
            <div className="bifrost-cms-card__title">{t.dashboard.publishedMix}</div>
            {data.distribution.length === NUMBER_ZERO ? (
              <Typography variant="body2" className="bifrost-cms__muted mb-0">
                {t.dashboard.listEmpty}
              </Typography>
            ) : (
              <div className="bifrost-cms-mix">
                {data.distribution.map((slice) => {
                  const percent =
                    distributionTotal > NUMBER_ZERO
                      ? Math.round((slice.value / distributionTotal) * CMS_PERCENT_BASE)
                      : NUMBER_ZERO;
                  const style = { width: `${percent}%` } as CSSProperties;
                  return (
                    <div key={slice.label} className="bifrost-cms-mix__item">
                      <span className="bifrost-cms-mix__nm">{slice.label}</span>
                      <div className="bifrost-cms-mix__track">
                        <span className="bifrost-cms-mix__fill" style={style} />
                      </div>
                      <span className="bifrost-cms-mix__ct">{formatNumber(slice.value)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
          <Card padding="md">
            <Flex justify="between" align="center" className="mb-2">
              <div className="bifrost-cms-card__title">{t.dashboard.activity}</div>
              {weeklyMax > NUMBER_ZERO ? (
                <Badge variant="info">
                  {t.dashboard.peakDay} {t.dashboard.weekdays[WEEKDAY_KEYS[Math.max(peakIndex, NUMBER_ZERO)]]}
                </Badge>
              ) : null}
            </Flex>
            <Typography variant="caption" className="bifrost-cms__muted mb-2 block">
              {formatNumber(weeklyTotal)} {t.dashboard.editsCount} · {t.dashboard.weekHint}
            </Typography>
            <div className="bifrost-cms-week">
              {data.weekly.map((value, index) => {
                const height = barHeightPercent(value, weeklyMax);
                const style = { height: `${height}%` } as CSSProperties;
                const isPeak = weeklyMax > NUMBER_ZERO && value === weeklyMax;
                return (
                  <div key={WEEKDAY_KEYS[index]} className="bifrost-cms-week__col">
                    <span className="bifrost-cms-week__val">{formatNumber(value)}</span>
                    <span
                      className={`bifrost-cms-week__fill${isPeak ? ' bifrost-cms-week__fill--hi' : ''}`}
                      style={style}
                    />
                    <span className="bifrost-cms-week__lbl">
                      {t.dashboard.weekdays[WEEKDAY_KEYS[index]]}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="bifrost-cms-bottom-row">
          <Card padding="md">
            <div className="bifrost-cms-card__title">{t.dashboard.aiUsageTitle}</div>
            <div className="bifrost-cms-progress">
              <span className="bifrost-cms-progress__fill" style={{ width: `${usagePercent}%` }} />
            </div>
            <div className="bifrost-cms-progress__meta">
              <span>
                {formatNumber(data.tokensUsed)} / {formatNumber(data.tokensLimit)}{' '}
                {t.dashboard.tokensMeta}
              </span>
              <span>{usagePercent.toFixed(1)}%</span>
            </div>
            <Typography variant="caption" className="bifrost-cms__muted mb-2 block">
              {t.dashboard.publishedRate}
            </Typography>
            <Progress value={publishRate} />
            <Button
              size="sm"
              variant="outline"
              className="bifrost-cms-btn-ghost"
              onClick={() => navigate(ROUTES.CMS_PLANS)}
            >
              {t.dashboard.viewUsage}
            </Button>
          </Card>
          <div className="bifrost-cms-focus">
            <div>
              <div className="bifrost-cms-focus__eyebrow">{t.dashboard.siteFocus}</div>
              <div className="bifrost-cms-focus__title">{site.siteName || t.cmsShell.brand}</div>
              <div className="bifrost-cms-focus__desc">{t.dashboard.siteFocusBody}</div>
            </div>
            <Button variant="primary" className="bifrost-cms-focus__cta" onClick={onOpenBuilder}>
              {t.dashboard.openBuilder}
            </Button>
          </div>
        </div>
      </Flex>
    </CmsShell>
  );
};
