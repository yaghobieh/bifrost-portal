# Changelog

## 1.1.11

### Added
- Marketing Pages builder follows the Elementor-style spec: searchable Bear widget library, hover toolbar, global colors, tablet viewport, and native HTML `<img>` (src, alt, width, height, loading).
- Design source for Figma: `docs/cms-135/` (spec, Bear props, HTML artboards).
- Documentation layout seeds four title/subtitle fields plus bash — page editor uses real inputs, not Ink.
- Translation picker widget on page edit: page (Global always listed), then that page's strings.

### Fixed
- Vercel `/api/*` proxies to cms-api so login is not swallowed by the SPA rewrite.
- Login form pane forces light Bear tokens (readable labels, inputs, alerts, outline buttons).
- Translations land on pages, keep Global in the list, and can add strings and pages.

## 1.1.10

### Added
- Live presence and crew chat fan-out between CMS agents.
- Live location avatars on page edit and Users.
- Cursor workers in `.cursor/workers` — commit as `Worker: {name}`.

### Fixed
- Crew chat no longer jumps the thread after messages are already read.
- Save and submit stay disabled when another editor already owns the page.
- Design nav and canvas are Marketing Pages (plugin blocks + right-click menu), not Stage.
- Cloudinary cloud name, API key, and secret come from Settings, installment, and `CLOUDINARY_URL`. Image loads go through that cloud.
- Public `/status` shows health, service status, and whether a newer CMS version is available.
- Update banner shows when the installed CMS is behind hub `1.1.10`.

### Planned for 1.1.11
- Chat read receipts (blue ticks), configurable
- Developer live agents page
- Anthropic Claude Sonnet 5 as default CMS copilot token (OpenAI failover)
- Plugin update badge
- Live agent AI on login
- Email and SMS send
- Cleaner roles (site admin, editor, manager)
- Tag a page or task from the Tasks board

### Changed
- CMS Cards use Bear `padding="md"` ([Bear Card](https://bearui.com/components/card)).
- CMS theme is redesign blue via BearProvider; Settings primary updates Bear live.
- CMS layout CSS is `cms.scss`. Marketing `portal.css` remains.
- Users & permissions page; Developer is the second tab.
- Content edit SEO and field handlers are named functions.

### Added
- Update banner changelog line even when already on this version.
- Content fields pick their input type (text, select, rich editor, and more) instead of a widget drawer.
- Marketing Pages blocks use CMS blue `#2951C4`.
- The 1.1.10 update uses Bear `Snackbar` instead of a custom banner.
