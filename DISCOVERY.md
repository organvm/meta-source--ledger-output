# DISCOVERY — organvm/meta-source--ledger-output

**Date:** 2026-06-22
**Verdict:** ✅ Real latent value — **PROMOTED** to the ranked tier (`value-repos.json`).
**Not archival.**

## Value Thesis

Behind an esoteric framing (numerology, mythology, "blockchain perpetuity"), this
repo is a working pnpm/turbo TypeScript monorepo whose **highest latent value is a
genuine, framework-agnostic cipher engine** living in `apps/cipher-rendering`. It is
not a spec or a stub: `ICipher` defines a clean state-machine contract, and Caesar,
Atbash, Vigenère, and a faithfully-implemented **simplified Enigma** (historical rotor
wirings, reflector, stepping logic) are all real, registry-registered implementations,
paired with frequency analysis and a **pluggable visual-metaphor renderer system**
(Wheel / Grid / Cascade) dispatched by cipher family. Decoupling cipher logic from
visualization through interfaces + registries is exactly the shape of a reusable asset:
it lifts cleanly out of the React app and serves a real external market — **interactive
cryptography education, CTF/teaching tools, and generative-art seeding** (the CrypTool /
Enigma-simulator niche, which has demonstrable demand). Underneath it, the already-
building `@meta-source/core` and `@meta-source/utils` packages add a deterministic
seeded PRNG, djb2 hashing, golden-ratio math, and numerology reduction — a clean,
dependency-light **generative substrate the rest of the estate can consume** and the
exact primitives the (currently placeholder) Phase-5 on-chain `pulse()` would need to
select ciphers and advance state deterministically. The specs are ~95% complete and the
implementation is ~35% real, but the real 35% is the valuable 35%. This is a discoverable
product/asset, not an archive.

## What it actually is (verified)

- **`@meta-source/core`** — TS types (identity / cipher / mythology / ledger) + φ
  constants. Builds clean; CI-gated.
- **`@meta-source/utils`** — real, working: numerology (Pythagorean/Chaldean reduction,
  master numbers), deterministic seeded hashing + PRNG (`seededRandom`, `generateSeed`),
  golden-ratio/Fibonacci/phyllotaxis math, color. Builds clean; CI-gated.
- **`apps/cipher-rendering`** — the standout. Working cipher state machines (Caesar,
  Atbash, Vigenère, **Enigma**), `cipherRegistry`, frequency analysis, and a
  family-keyed `metaphorRegistry` of Wheel/Grid/Cascade renderers. ← highest value.
- **`apps/identity-playground`** — numerology engines (Gematria/Chaldean/Pythagorean) +
  golden-ratio / phyllotaxis generative canvases (2D/3D).
- **`apps/mythology-playground`**, **`apps/hierarchy-visualizer`** — smaller React /
  Three.js companion apps (φ-operators, token parser, lens hierarchy).
- **`contracts/`** — placeholder only; **no Solidity yet** (Phase 5 is unbuilt).

## Build state (honest)

- ✅ CI "Build packages" (`@meta-source/core`, `@meta-source/utils`) — green.
- ✅ `pnpm turbo typecheck` (all 8) — **made green in this PR** (fixed a regression from
  the recent dependabot TS 6.0 bump: a `baseUrl` deprecation-as-error, a missing
  `vite-env.d.ts` for a CSS side-effect import, and one unused param).
- ⚠️ `pnpm turbo lint` — **pre-existing red, not a regression**: no ESLint config has
  ever existed in the repo and ESLint 9+ requires flat config. Estate-wide infra debt.
- ⚠️ Full app `build` — `mythology-playground` fails on Tailwind v4's moved PostCSS
  plugin (`@tailwindcss/postcss`); also from the dependabot bump, also pre-existing and
  outside the CI build filter.

## Single best concrete first task

**Extract the cipher engine into a headless `@meta-source/cipher-engine` workspace
package.** Move `core/CipherInterface.ts`, the four ciphers, `cipherRegistry`,
`analysis/frequency.ts`, and the metaphor interfaces/registry out of
`apps/cipher-rendering/src` into `packages/cipher-engine` (mirroring `core`/`utils`),
have the React app consume it, and add the first vitest suite (Caesar round-trip,
Vigenère round-trip, Enigma reciprocity). This makes the asset reusable across the
estate, independently testable, and the literal foundation for Phase-5's on-chain
deterministic cipher selection — converting the repo's best 35% into a shippable unit.
