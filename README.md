# Music Money v2.0.2

Clean, professional mobile-first Apple-style music subscription tracker.

## v2.0.2 changes
- Fixed landing page drifting sideways / looking zoomed-out: the Duo mockup, its shadow and tilt animation no longer overflow the screen width.
- Added text-size-adjust so iOS doesn't inflate fonts; hero and feature headlines now scale fluidly with clamp().
- Switched 100vh sections to 100svh so Safari's toolbar doesn't cause jumps; disabled the float animation on phones.

## v2.0 changes
- Fixed iPhone Home Screen icon handling using a single explicit 180px Apple touch icon and matching PWA manifest icons, following the proven working setup used by the reference PWA.
- Simplified the icon setup to one authoritative 180px Apple touch icon plus 512px PWA icon, with a dedicated favicon.
- Improved the PWA manifest with explicit `id`, `scope`, `start_url`, description and clean icon references.
- Added the Apple standalone status-bar metadata.
- Versioned CSS, JavaScript and manifest references to v2.0.
- Kept the existing `music-money-v1` localStorage key intentionally unchanged so upgrading to v2.0 does not wipe existing members, payments or settings.
- Improved the member Payment Status editor: choose 1–12 months paid, select the exact last-paid month, and select the last-paid year.
- Kept the existing payment history, reminders, WhatsApp actions, backup/import and member/account functionality intact.

## Important upgrade note
If an older Music Money shortcut still shows the previous icon, remove that old Home Screen shortcut and add the v2.0 site to the Home Screen again. The v2.0 HTML points Safari at a new icon URL; this is the most reliable way to make iOS discard the old shortcut icon.

## Data compatibility
The app continues using the storage key `music-money-v1` deliberately. The release number is 2.0, but the data namespace remains unchanged for backward compatibility.

## GitHub Pages
Upload the files in this folder to the root of your GitHub repository and enable GitHub Pages from the `main` branch and `/ (root)`.
