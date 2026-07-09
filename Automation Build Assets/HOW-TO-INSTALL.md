# How to install the Autonomous Build system

This folder contains a ready-to-drop `.claude/` folder.

## Quick install
1. Copy the **`.claude`** folder from here into the **root** of your target project
   (next to `package.json` / `.git`).
2. If the project already has a `.claude/settings.json`, don't overwrite it — open both
   and merge the `"hooks"` block from this one into the existing file.
3. Restart Claude Code in that project so it loads the hook.
4. Run `/hooks` to confirm the `Stop` hook is registered.
5. To turn the loop ON: open `.claude/autonomous-build.flag` and change the first line
   from `STOP` to `ACTIVE`. To turn it OFF: change it back to `STOP` (or delete the file).

## What's inside `.claude/`
```
.claude/
├── settings.json                 registers the Stop hook
├── autonomous-build.flag         your ON/OFF switch (ships OFF = "STOP")
├── README.md                     full docs
└── hooks/
    └── build-continue-guard.mjs  the guard (Node, no dependencies)
```

## Notes
- The flag ships set to `STOP` (disarmed) so nothing happens until you arm it.
- The hook needs `node` available on PATH (true for any Node/npm project). For a
  Node-less project, port the guard script to Python and update the `command` in
  `settings.json`.
- Full details and caveats are in `.claude/README.md`.

> Note on OneDrive/Windows: `.claude` is a dot-folder and File Explorer may hide it.
> If you don't see it, enable "Hidden items" in Explorer's View menu, or copy it from
> a terminal: `xcopy /E /I /H ".claude" "C:\path\to\project\.claude"`.
