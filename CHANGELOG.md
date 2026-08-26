# Changelog

## 1.1.10

### Added
- Live presence and crew chat fan-out between CMS agents.
- Live location avatars on page edit and Users.
- Cursor workers in `.cursor/workers` — commit as `Worker: {name}`.

### Fixed
- Online / green Online and chat delivery between two logged-in agents.
- Health comes from the live socket, not HTTP polling.
- Public site topbar links are white on the dark nav.

### Planned for 1.1.11
- Chat read receipts (blue ticks), configurable
- Developer live agents page
- Anthropic Claude Sonnet 5 as default CMS copilot token (OpenAI failover)
- Plugin update badge
- Live agent AI on login
- Email and SMS send
- Cleaner roles (site admin, editor, manager)
- Changeable chat status

### Changed
- CMS Cards use Bear `padding="md"` ([Bear Card](https://bearui.com/components/card)).
- CMS theme is redesign blue via BearProvider; Settings primary updates Bear live.
- CMS layout CSS is `cms.scss`. Marketing `portal.css` remains.
- Users & permissions page; Developer is the second tab.
- Content edit SEO and field handlers are named functions.

### Added
- Update banner changelog line even when already on this version.
- Content fields pick their input type (text, select, rich editor, and more) instead of a widget drawer.
- Stage marketing blocks use CMS blue `#2951C4`.
- The 1.1.10 update uses Bear `Snackbar` instead of a custom banner.
