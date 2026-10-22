import { useState, type FC } from 'react';
import { Badge, BearIcons, Button, Card, Flex, Input, Typography } from '@forgedevstack/bear';

type ComponentType = 'Button' | 'Card' | 'Badge' | 'Input' | 'Typography';
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonRadius = 'default' | 'pill' | 'square';
type CodeTab = 'react' | 'curl' | 'cli';

export const ComponentDocsView: FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentType>('Button');
  
  // Button Knobs
  const [btnVariant, setBtnVariant] = useState<ButtonVariant>('primary');
  const [btnSize, setBtnSize] = useState<ButtonSize>('md');
  const [btnRadius, setBtnRadius] = useState<ButtonRadius>('default');
  const [btnLabel, setBtnLabel] = useState('Explore Documentation');
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnSpotlight, setBtnSpotlight] = useState(false);
  const [btnIcon, setBtnIcon] = useState<'none' | 'plus' | 'check' | 'star' | 'arrow'>('arrow');
  const [btnFullWidth, setBtnFullWidth] = useState(false);

  // Code Tab state
  const [activeCodeTab, setActiveCodeTab] = useState<CodeTab>('react');
  const [copiedCode, setCopiedCode] = useState(false);

  // Live API Tester state
  const [apiTesting, setApiTesting] = useState(false);
  const [apiResponse, setApiResponse] = useState<{
    status: number;
    latencyMs: number;
    data: unknown;
  } | null>(null);

  const getIconElement = () => {
    switch (btnIcon) {
      case 'plus':
        return <BearIcons.PlusIcon size={14} />;
      case 'check':
        return <BearIcons.CheckIcon size={14} />;
      case 'star':
        return <BearIcons.StarIcon size={14} />;
      case 'arrow':
        return <BearIcons.ArrowRightIcon size={14} />;
      default:
        return undefined;
    }
  };

  const generateReactCode = () => {
    const iconImport = btnIcon !== 'none' ? `\nimport { BearIcons } from '@forgedevstack/bear-icons';` : '';
    const iconProp = btnIcon !== 'none' 
      ? `\n  icon={<BearIcons.${btnIcon === 'arrow' ? 'ArrowRightIcon' : btnIcon.charAt(0).toUpperCase() + btnIcon.slice(1) + 'Icon'} size={14} />}` 
      : '';
    const loadingProp = btnLoading ? `\n  loading={true}` : '';
    const disabledProp = btnDisabled ? `\n  disabled={true}` : '';
    const spotlightProp = btnSpotlight ? `\n  spotlight={true}` : '';
    const fullWidthProp = btnFullWidth ? `\n  fullWidth={true}` : '';
    const radiusProp = btnRadius !== 'default' ? `\n  radius="${btnRadius}"` : '';

    return `import { Button } from '@forgedevstack/bear';${iconImport}

export const MyComponent = () => {
  return (
    <Button
      variant="${btnVariant}"
      size="${btnSize}"${radiusProp}${iconProp}${loadingProp}${disabledProp}${spotlightProp}${fullWidthProp}
      onClick={() => console.log('Action triggered')}
    >
      ${btnLabel}
    </Button>
  );
};`;
  };

  const generateCurlCode = () => {
    return `# Fetch button component metadata & schema from Headless CMS API
curl -X GET "https://bifrost-portal.vercel.app/api/components/button" \\
  -H "Accept: application/json" \\
  -H "Authorization: Bearer <api_token>" \\
  -H "X-Site-Id: default"`;
  };

  const generateCliCode = () => {
    return `# Scaffold Bear component in your local Bifrost app
npx @forgedevstack/bifrost-cli extend --component button --variant ${btnVariant}`;
  };

  const handleCopy = (code: string) => {
    void navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const runApiTest = () => {
    setApiTesting(true);
    const start = performance.now();
    setTimeout(() => {
      const latency = Math.round(performance.now() - start + 28);
      setApiResponse({
        status: 200,
        latencyMs: latency,
        data: {
          component: 'Button',
          version: '1.3.1',
          package: '@forgedevstack/bear',
          activePalette: {
            primary: 'var(--bear-primary-500, #1E3A8A)',
            hover: 'var(--bear-primary-600, #172554)',
            ring: 'var(--bear-primary-400, #38BDF8)',
          },
          props: {
            variant: btnVariant,
            size: btnSize,
            radius: btnRadius,
            disabled: btnDisabled,
            loading: btnLoading,
            spotlight: btnSpotlight,
            label: btnLabel,
          },
          schema: {
            type: 'ui_component',
            category: 'action',
            framework: 'react',
            styledWith: 'vanilla-css-variables',
          },
        },
      });
      setApiTesting(false);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="info" className="bg-[var(--bear-primary-500,#1E3A8A)] text-white font-semibold text-xs px-2.5 py-0.5">
                bearui.com Docs Studio
              </Badge>
              <Badge variant="outline" className="text-cyan-400 border-cyan-800 text-xs">
                @forgedevstack/bear v1.3.1
              </Badge>
              <span className="text-xs text-gray-400">· Dynamic Theme Palette Bound</span>
            </div>
            <Typography variant="h2" className="text-2xl font-bold text-white mb-1">
              Button Component Documentation
            </Typography>
            <Typography variant="body2" className="text-gray-300 max-w-2xl text-sm">
              Explore interactive properties, live canvas rendering, instant multi-language code snippets, and live headless CMS API testing modeled after bearui.com/components/button.
            </Typography>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="border-slate-700 text-gray-200 hover:bg-slate-800 flex items-center gap-1.5"
              onClick={() => window.open('https://bearui.com/components/button', '_blank')}
            >
              <BearIcons.GlobeIcon size={13} />
              <span>bearui.com</span>
            </Button>
            <Button
              size="sm"
              variant="primary"
              className="bg-[var(--bear-primary-500,#1E3A8A)] hover:bg-[var(--bear-primary-600,#172554)] text-white shadow-sm flex items-center gap-1.5"
              onClick={runApiTest}
              loading={apiTesting}
            >
              <BearIcons.PlayIcon size={13} />
              <span>Test Live API</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Component Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {(['Button', 'Card', 'Badge', 'Input', 'Typography'] as ComponentType[]).map((comp) => (
          <button
            key={comp}
            type="button"
            onClick={() => setSelectedComponent(comp)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              selectedComponent === comp
                ? 'bg-[var(--bear-primary-500,#1E3A8A)] text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {comp}
          </button>
        ))}
      </div>

      {/* Interactive Playground & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Area (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <Card variant="outlined" padding="none" className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-3.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <Typography variant="caption" className="font-semibold text-xs text-gray-700 uppercase tracking-wider">
                  Live Canvas Preview
                </Typography>
              </div>
              <Typography variant="caption" className="text-xs text-gray-400">
                Palette: Primary ({btnVariant})
              </Typography>
            </div>

            {/* Canvas Body with dotted grid */}
            <div
              className="p-12 min-h-[260px] flex items-center justify-center relative bg-slate-50/60"
              style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            >
              <Button
                variant={btnVariant}
                size={btnSize}
                radius={btnRadius}
                disabled={btnDisabled}
                loading={btnLoading}
                spotlight={btnSpotlight}
                fullWidth={btnFullWidth}
                icon={getIconElement()}
                onClick={() => alert(`Button clicked! Variant: ${btnVariant}, Size: ${btnSize}`)}
                className="shadow-sm"
              >
                {btnLabel}
              </Button>
            </div>

            {/* Canvas Footer Status */}
            <div className="p-3 bg-gray-50/80 border-t border-gray-200 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
              <div className="flex items-center gap-3">
                <span>Variant: <strong className="text-gray-900">{btnVariant}</strong></span>
                <span>Size: <strong className="text-gray-900">{btnSize}</strong></span>
                <span>Radius: <strong className="text-gray-900">{btnRadius}</strong></span>
              </div>
              <span className="text-[11px] text-gray-400">Click button to trigger interactive action</span>
            </div>
          </Card>

          {/* Code Snippets Viewer */}
          <Card variant="outlined" padding="none" className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-sm text-gray-100">
            <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {(['react', 'curl', 'cli'] as CodeTab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveCodeTab(tab)}
                    className={`px-3 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                      activeCodeTab === tab
                        ? 'bg-slate-800 text-white font-semibold'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    {tab === 'react' ? 'React TSX' : tab === 'curl' ? 'cURL API' : 'CLI Scaffold'}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleCopy(
                  activeCodeTab === 'react' ? generateReactCode() : activeCodeTab === 'curl' ? generateCurlCode() : generateCliCode()
                )}
                className="px-2.5 py-1 text-xs text-gray-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode ? (
                  <>
                    <BearIcons.CheckIcon size={12} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <BearIcons.CopyIcon size={12} />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
              <code>
                {activeCodeTab === 'react' && generateReactCode()}
                {activeCodeTab === 'curl' && generateCurlCode()}
                {activeCodeTab === 'cli' && generateCliCode()}
              </code>
            </pre>
          </Card>
        </div>

        {/* Knobs / Property Inspector (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card variant="outlined" padding="md" className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
              <BearIcons.SettingsIcon size={16} className="text-[var(--bear-primary-500,#1E3A8A)]" />
              <Typography variant="h3" className="text-sm font-bold text-gray-900 mb-0">
                Interactive Knobs &amp; Props
              </Typography>
            </div>

            <div className="flex flex-col gap-4">
              {/* Button Label */}
              <div>
                <Typography variant="caption" className="text-xs font-semibold text-gray-700 mb-1 block">
                  Button Label
                </Typography>
                <Input
                  size="sm"
                  value={btnLabel}
                  onChange={(e) => setBtnLabel(e.target.value)}
                  placeholder="Enter button text..."
                />
              </div>

              {/* Variant Selector */}
              <div>
                <Typography variant="caption" className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  Variant
                </Typography>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['primary', 'secondary', 'outline', 'ghost', 'success', 'warning', 'danger'] as ButtonVariant[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setBtnVariant(v)}
                      className={`px-2 py-1 rounded text-xs font-medium border capitalize cursor-pointer transition-colors ${
                        btnVariant === v
                          ? 'bg-[var(--bear-primary-500,#1E3A8A)] text-white border-[var(--bear-primary-500,#1E3A8A)]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div>
                <Typography variant="caption" className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  Size
                </Typography>
                <div className="flex items-center gap-1.5">
                  {(['xs', 'sm', 'md', 'lg', 'xl'] as ButtonSize[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setBtnSize(s)}
                      className={`flex-1 py-1 rounded text-xs font-medium border uppercase cursor-pointer transition-colors ${
                        btnSize === s
                          ? 'bg-[var(--bear-primary-500,#1E3A8A)] text-white border-[var(--bear-primary-500,#1E3A8A)]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Radius Selector */}
              <div>
                <Typography variant="caption" className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  Corner Radius
                </Typography>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['default', 'pill', 'square'] as ButtonRadius[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setBtnRadius(r)}
                      className={`py-1 rounded text-xs font-medium border capitalize cursor-pointer transition-colors ${
                        btnRadius === r
                          ? 'bg-[var(--bear-primary-500,#1E3A8A)] text-white border-[var(--bear-primary-500,#1E3A8A)]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <Typography variant="caption" className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  Icon Attachment
                </Typography>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['none', 'plus', 'check', 'star', 'arrow'] as const).map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setBtnIcon(ic)}
                      className={`py-1 rounded text-xs font-medium border capitalize cursor-pointer transition-colors ${
                        btnIcon === ic
                          ? 'bg-[var(--bear-primary-500,#1E3A8A)] text-white border-[var(--bear-primary-500,#1E3A8A)]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* State Toggles */}
              <div className="border-t border-gray-100 pt-3 flex flex-col gap-2.5">
                <label className="flex items-center justify-between text-xs text-gray-700 cursor-pointer">
                  <span>Loading Spinner</span>
                  <input
                    type="checkbox"
                    checked={btnLoading}
                    onChange={(e) => setBtnLoading(e.target.checked)}
                    className="rounded text-blue-900 focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-gray-700 cursor-pointer">
                  <span>Disabled State</span>
                  <input
                    type="checkbox"
                    checked={btnDisabled}
                    onChange={(e) => setBtnDisabled(e.target.checked)}
                    className="rounded text-blue-900 focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-gray-700 cursor-pointer">
                  <span>Spotlight Mouse Tracker</span>
                  <input
                    type="checkbox"
                    checked={btnSpotlight}
                    onChange={(e) => setBtnSpotlight(e.target.checked)}
                    className="rounded text-blue-900 focus:ring-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-gray-700 cursor-pointer">
                  <span>Full Width</span>
                  <input
                    type="checkbox"
                    checked={btnFullWidth}
                    onChange={(e) => setBtnFullWidth(e.target.checked)}
                    className="rounded text-blue-900 focus:ring-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Live API Tester Response Drawer (if tested) */}
      {apiResponse && (
        <Card variant="outlined" padding="md" className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg text-white animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Badge variant="success" className="bg-emerald-600 text-white font-bold text-xs px-2 py-0.5">
                HTTP {apiResponse.status} OK
              </Badge>
              <span className="text-xs text-gray-400">GET /api/components/button</span>
              <span className="text-xs text-emerald-400 font-mono">⚡ {apiResponse.latencyMs}ms</span>
            </div>
            <button
              type="button"
              onClick={() => setApiResponse(null)}
              className="text-gray-400 hover:text-white text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
          <pre className="text-xs font-mono text-emerald-300 overflow-x-auto bg-slate-950 p-4 rounded-lg">
            {JSON.stringify(apiResponse.data, null, 2)}
          </pre>
        </Card>
      )}

      {/* Props Reference Table */}
      <Card variant="outlined" padding="none" className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <Typography variant="h3" className="text-sm font-bold text-gray-900 mb-0">
            Button Props Specification Reference
          </Typography>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4">Prop</th>
                <th className="py-2.5 px-4">Type</th>
                <th className="py-2.5 px-4">Default</th>
                <th className="py-2.5 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-blue-900">variant</td>
                <td className="py-2.5 px-4 font-mono text-gray-500">'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger'</td>
                <td className="py-2.5 px-4 font-mono text-gray-400">'primary'</td>
                <td className="py-2.5 px-4">Visual appearance style dynamically bound to BearProvider palette</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-blue-900">size</td>
                <td className="py-2.5 px-4 font-mono text-gray-500">'xs' | 'sm' | 'md' | 'lg' | 'xl'</td>
                <td className="py-2.5 px-4 font-mono text-gray-400">'md'</td>
                <td className="py-2.5 px-4">Button size with proportional padding, font size, and gap</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-blue-900">radius</td>
                <td className="py-2.5 px-4 font-mono text-gray-500">'default' | 'pill' | 'square' | 'none'</td>
                <td className="py-2.5 px-4 font-mono text-gray-400">'default'</td>
                <td className="py-2.5 px-4">Border corner radius curvature</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-blue-900">loading</td>
                <td className="py-2.5 px-4 font-mono text-gray-500">boolean</td>
                <td className="py-2.5 px-4 font-mono text-gray-400">false</td>
                <td className="py-2.5 px-4">Replaces content with active Bear spinner indicator</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-blue-900">disabled</td>
                <td className="py-2.5 px-4 font-mono text-gray-500">boolean</td>
                <td className="py-2.5 px-4 font-mono text-gray-400">false</td>
                <td className="py-2.5 px-4">Disables pointer interactions and reduces opacity to 50%</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono font-bold text-blue-900">spotlight</td>
                <td className="py-2.5 px-4 font-mono text-gray-500">boolean</td>
                <td className="py-2.5 px-4 font-mono text-gray-400">false</td>
                <td className="py-2.5 px-4">Interactive radial cursor spotlight glow effect</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
