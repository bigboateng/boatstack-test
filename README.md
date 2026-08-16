# Boatstack Test

An intentionally small template repository for testing repository-owned
Boatstack setup and product delivery.

## Layout

- `.boatstack/flows` — the authored product-delivery Flow, its declared assets,
  and compiled Flow IR.
- `.boatstack/plans` — retained source plans and the active plan inbox.
- `.boatstack/project.json` — repository delivery configuration.
- `.boatstack/runtime.json` and `.boatstack/host-skills.json` — the pinned
  runtime and generated host-skill manifest.
- `.agents`, `.claude`, `.cursor`, and `.gemini` — generated host projections.
- `projects/basic-react` — the Vite React TypeScript test project.

Boatstack control artifacts live under `.boatstack`; the repository does not
keep separate root-level `plans` or `control-flows` copies.

## Boatstack Flow

```sh
npm install
npm run boatstack:flow:compile
npm run boatstack:flow:check
```

## Basic React project

```sh
npm --prefix projects/basic-react install
npm --prefix projects/basic-react run dev
npm --prefix projects/basic-react run check
npm --prefix projects/basic-react run build
```
