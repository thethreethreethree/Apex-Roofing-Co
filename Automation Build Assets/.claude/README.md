# Autonomous Build — HARD MODE (drop-in for Claude Code)

A **Stop hook** that keeps a Claude Code agent building until *you* say stop. While
armed, every attempt by the agent to end a turn is blocked and it is told to keep
going. You hold the only off switch: a single flag file.

## Files
- `settings.json` — registers the Stop hook with Claude Code.
- `hooks/build-continue-guard.mjs` — the guard logic (Node, no dependencies).
- `autonomous-build.flag` — the control switch (first line = `ACTIVE` or `STOP`).

## Arm / disarm
| You want to… | Do this |
|---|---|
| **Arm / resume** the loop | Set the flag's **first line** to `ACTIVE` |
| **Pause / stop** it | Set the **first line** to `STOP` (or delete the flag file) |
| Turn the whole mechanism off | Delete `autonomous-build.flag`, or remove the `Stop` block from `settings.json` |

Stop words accepted on the first line: `STOP`, `HALT`, `STAND DOWN`, `END`, `END BUILD`,
`DONE`, `CEASE`. Anything else (e.g. `ACTIVE`) keeps the loop armed.

## Install
1. Copy this whole `.claude/` folder into your project root.
2. If the project **already** has `.claude/settings.json`, merge the `"hooks"` block
   instead of overwriting.
3. **Restart Claude Code** so it loads the hook (hooks are read at session start).
4. Verify with `/hooks` — you should see the `Stop` hook listed.
5. Flip `autonomous-build.flag` first line to `ACTIVE` when you want the loop.
6. (macOS/Linux only) `chmod +x .claude/hooks/build-continue-guard.mjs`.

## Know before you rely on it
1. **It does not create turns.** The hook only *blocks stopping*; it can't make the
   agent talk to itself. You still drive the session each turn (keep replying, or use
   Claude Code's `/loop` to auto-send a prompt on an interval). It prevents the agent
   from stopping *early* within a driven session.
2. **`node` must be on PATH** in the environment Claude Code runs hooks in. For a
   Node-less project, port the ~30 lines of the guard to Python and change the
   `command` in `settings.json` accordingly.
3. **Paths are relative to the project root** (`.claude/...`) — portable as-is.
4. **It fails open:** if the flag file is missing or unreadable, the agent is allowed
   to stop. So a corrupt file can never wedge your session — worst case the loop just
   disarms.
5. **It's a discipline enforcer, not a sandbox.** Its only power is refusing to end a
   turn while `ACTIVE`. Keep the flag file in version control so the switch is visible.
