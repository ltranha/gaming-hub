# Skill: Repo Drift Audit

Check that documentation matches actual implementation state.

## Steps
1. Read game-registry.ts for list of games
2. Verify each game has: page.tsx, client.tsx, logic file
3. Check README game table matches registry
4. Check CONTEXT.md game table matches registry
5. Verify all routes in registry have corresponding app/ directories
6. Report any drift (missing files, stale docs, wrong status)
