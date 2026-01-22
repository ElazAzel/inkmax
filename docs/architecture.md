# Architecture Overview

This project follows a clean-architecture-inspired layout with clear separation between
UI, application workflows, domain logic, and infrastructure integrations.

## Layers

1. **Presentation**
   - `src/pages/` route-level screens.
   - `src/components/` reusable UI and page sections.
   - `src/hooks/` UI orchestration and data fetching coordination.

2. **Application**
   - `src/use-cases/` orchestrates multi-step workflows (e.g., page creation, publishing).
   - `src/services/` encapsulates business logic that crosses boundaries or aggregates data.

3. **Domain**
   - `src/domain/` entities and domain rules (validation, value objects).
   - `src/types/` shared interfaces and DTOs.

4. **Infrastructure / Platform**
   - `src/platform/supabase/` Supabase client setup and generated types.
   - `src/repositories/` Supabase-backed data access implementations.

5. **Testing**
   - `src/testing/` shared fixtures and test setup.

## Data Flow

UI components and pages call hooks → hooks invoke use-cases or services → services/use-cases
call repositories → repositories talk to Supabase through the platform client.

## Cross-cutting Concerns

- **i18n**: `src/i18n/` houses localization config and dictionaries.
- **Utilities**: `src/lib/` contains shared helpers and utilities used across layers.

## Notes for Future Changes

- Prefer adding new external integrations under `src/platform/` to keep infrastructure
  concerns isolated.
- Keep domain entities free of React or infrastructure dependencies.
- When adding a new workflow, start in `use-cases/` and only add services if logic
  spans multiple repositories or external systems.
