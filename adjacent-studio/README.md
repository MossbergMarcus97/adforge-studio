# AdForge Mission Control (Adjacent Rebuild v2)

A full UX/UI rethink that keeps the feature set but changes the product model from a tool board to a systematic campaign operating flow.

## New Information Architecture

1. Account Architecture
2. Identity Lab
3. Narrative Planner
4. Production Board
5. Delivery Ops

Layout:
- Portfolio Sidebar: client/brand/campaign scope
- Journey Map: phase-based navigation with completion state
- Stage Workspace: deep controls per phase
- Signal Rail: live preview and health metrics

## Core capabilities retained

- Multi-tenant hierarchy: Client -> Brand -> Campaign
- Brand system:
  - logo upload and primary lockup
  - palette presets + custom editor + contrast validation
  - imagery upload + treatment filters
- Typography system:
  - heading/body/accent assignments
  - add any Google font by family
  - upload custom `.ttf`, `.otf`, `.woff`, `.woff2`
- Messaging system:
  - objective, audience, channel, message, proof points, CTA, tone
  - message angle matrix
- Creative operations:
  - status-board workflow (Draft, In Review, Approved, Live)
  - manual concept creation + generated concept pack
- Launch operations:
  - readiness checks
  - campaign brief snapshot
  - CSS variable export
  - JSON export/import

## Design strategy notes

See `/Users/marcusmossberg/Documents/AdForge/adjacent-studio/DESIGN_DIRECTIONS.md` for the design-direction forum, tradeoffs, and selected concept rationale.

## Run locally

Open:

`/Users/marcusmossberg/Documents/AdForge/adjacent-studio/index.html`
