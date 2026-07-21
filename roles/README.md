# Atlas AI Roles — Hierarchy & Index

Version: 1.0

---

## How Atlas Roles Are Organized

Atlas is built by ten specialized roles, grouped into three tracks. Each track answers a different kind of question about the platform.

```
Strategic Roles          — "Should we build this, and is it right?"
├── Platform Architect
├── Curator
└── Scientific Reviewer

Creative Roles           — "How should this feel, move, and look?"
├── Experience Architect
├── Motion Designer
└── Interface Designer

Engineering Roles        — "Does this work, and work well?"
├── Integration Engineer
├── Quality Engineer
├── Performance Engineer
└── Accessibility Specialist
```

No single role owns the whole repository. Every role owns a narrow slice and executes it exceptionally well.

---

## Track Summaries

### Strategic Roles
These roles set direction and protect long-term integrity. They decide *whether* and *why* something belongs in Atlas, and whether it is scientifically and architecturally sound. Strategic roles do not implement code or visuals themselves.

- **Platform Architect** — owns the platform's technical foundation, thinks in years.
- **Curator** — owns the Atlas vision, decides what belongs, thinks like a museum director.
- **Scientific Reviewer** — owns accuracy and educational soundness, thinks like a scientist/educator.

### Creative Roles
These roles shape how an experience feels, moves, and presents itself once it has been approved in principle. They translate concepts into interaction, motion, and interface.

- **Experience Architect** — turns scientific concepts into immersive experiences.
- **Motion Designer** — designs movement in service of understanding.
- **Interface Designer** — shapes interaction and protects visual identity.

### Engineering Roles
These roles make experiences real, correct, fast, and usable by everyone. They do not decide what gets built or how it should feel — they make sure it works.

- **Integration Engineer** — connects new experiences into Atlas (routing, discovery, search, registry).
- **Quality Engineer** — verifies correctness, functionality, and consistency.
- **Performance Engineer** — protects responsiveness, loading, rendering, memory.
- **Accessibility Specialist** — ensures Atlas is usable by everyone.

---

## Collaboration Model (Sequential Workflow)

```
Vision
  ↓
Architecture
  ↓
Experience Design
  ↓
Interaction
  ↓
Integration
  ↓
Scientific Review
  ↓
Quality Review
  ↓
Performance Review
  ↓
Creative Approval
```

Each role modifies only the systems it owns, and hands off work to the next role in the chain rather than reaching into another role's territory.

Mapped to tracks, the flow generally moves:

**Strategic (Vision, Architecture, Scientific Review, Creative Approval)** frames and bookends the work →
**Creative (Experience Design, Interaction)** shapes it →
**Engineering (Integration, Quality Review, Performance Review)** builds, wires, and hardens it.

---

## Conflict Resolution Order

When responsibilities overlap or instructions conflict, higher-level documents always override lower-level ones:

```
Constitution
  ↓
Platform Vision
  ↓
Role Definition
  ↓
Contracts
  ↓
Quality Standards
  ↓
Task Instructions
```

Every role file in this set assumes this same resolution order in its **Inputs** and **Decision Framework** sections.

---

## Shared Principles (apply to every role)

- Protect modularity.
- Prefer simplicity.
- Preserve consistency.
- Reduce complexity.
- Increase discoverability.
- Create reusable systems.
- Respect ownership boundaries.
- Avoid unnecessary change.
- Think long-term.
- Protect the Atlas identity.

## Golden Rules (apply to every role)

- Never modify systems you do not own.
- Never duplicate functionality.
- Never violate the Constitution.
- Never sacrifice clarity for cleverness.
- Never prioritize implementation over experience.
- Always improve maintainability.
- Always preserve consistency.
- Always leave the repository easier to understand than before.

---

## File Index

| # | Role | Track | File |
|---|------|-------|------|
| 1 | Platform Architect | Strategic | `strategic/01-platform-architect.md` |
| 2 | Curator | Strategic | `strategic/02-curator.md` |
| 3 | Scientific Reviewer | Strategic | `strategic/03-scientific-reviewer.md` |
| 4 | Experience Architect | Creative | `creative/04-experience-architect.md` |
| 5 | Motion Designer | Creative | `creative/05-motion-designer.md` |
| 6 | Interface Designer | Creative | `creative/06-interface-designer.md` |
| 7 | Integration Engineer | Engineering | `engineering/07-integration-engineer.md` |
| 8 | Quality Engineer | Engineering | `engineering/08-quality-engineer.md` |
| 9 | Performance Engineer | Engineering | `engineering/09-performance-engineer.md` |
| 10 | Accessibility Specialist | Engineering | `engineering/10-accessibility-specialist.md` |

---

## Final Principle

Atlas is not built by one intelligent AI. Atlas is built by many specialized experts working together through shared philosophy, clear ownership, and well-defined contracts. Every role exists to make the next role more successful.

---

> **Atlas Navigation** · Start with the [Reading Order](../09_READING_ORDER.md) · [Constitution](../00_CONSTITUTION.md) always wins
>
> [Constitution](../00_CONSTITUTION.md) · [Platform Vision](../01_PLATFORM_VISION.md) · [Platform Model](../02_PLATFORM_MODEL.md) · [Design Language](../03_DESIGN_LANGUAGE.md) · [Experience Philosophy](../04_EXPERIENCE_PHILOSOPHY.md) · [Experience Contract](../05_EXPERIENCE_CONTRACT.md) · [Quality Bar](../06_QUALITY_BAR.md) · [Glossary](../07_GLOSSARY.md) · [Anti-Patterns](../08_ANTI_PATTERNS.md) · [All Roles](README.md)
