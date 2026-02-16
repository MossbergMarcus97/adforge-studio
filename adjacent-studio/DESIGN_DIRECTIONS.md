# AdForge Redesign Forum

This document captures the redesign options considered before implementation and the selected direction.

## Direction A: Mission Control (Selected)
- Core idea: Command center for portfolio-scale campaign operations.
- UX shape: Portfolio Sidebar -> Execution Journey -> Stage Workspace -> Signal Rail.
- Why: Strong for teams managing many brands/campaigns at once while still preserving a guided path.
- Visual language: Editorial headings, atmospheric grid, high-contrast card hierarchy, progress-rich phase navigation.

## Direction B: Narrative Studio
- Core idea: Messaging-first workflow where brand and creative are downstream from positioning.
- UX shape: Story brief canvas first, then identity and production tabs.
- Why: Best for teams that treat strategy and narrative as the system root.
- Tradeoff: Slower for operators who need rapid multi-campaign setup.

## Direction C: Asset Factory
- Core idea: Throughput-driven creative production pipeline.
- UX shape: Kanban and batch-edit tools dominate; setup and strategy are compact side flows.
- Why: Best when creative volume and status transitions are the main bottleneck.
- Tradeoff: Can under-serve brand and messaging quality if used as the default mode.

## Selected Journey (Implemented)
1. Account Architecture
2. Identity Lab
3. Narrative Planner
4. Production Board
5. Delivery Ops

## Why this direction won
- Keeps feature depth, but reframes the product around clear operational sequencing.
- Handles one-to-many scale: Client -> Brand -> Campaign with persistent context.
- Makes completion status explicit at each phase, reducing ambiguity in handoff.

## External references used
- Atlassian Design System overview and principles: https://atlassian.design/get-started/about-atlassian-design-system
- Atlassian spacing foundations (structured visual rhythm): https://atlassian.design/foundations/spacing
- Shopify app design guidelines (predictability, accessibility, mobile-adaptive behavior): https://shopify.dev/docs/apps/design
- Figma design process framework (collaboration + iteration workflow): https://www.figma.com/design-process/
