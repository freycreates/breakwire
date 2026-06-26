# BreakWire Playlists

An early-2000s Mac OS X / file-sharing inspired playlist prop site for *The Big Break*.

The page shows character playlists in a fictional BreakWire interface, with messy MP3 filenames, fake transfer progress, desktop clutter, a visualizer, and hidden external play links.

## Characters

- Leona: `copydesk_queen`
- Vivienne: `vivienne_onboard`
- Sophia: `miniDV_soph`
- Bernard: `bernardcare69`

## Run Locally

Use the local server if you want playlist refresh and exact external track links:

```bash
python3 server.py
```

Then open:

```text
http://localhost:4174/
```

## Static Use

You can also open `index.html` directly or host the files with GitHub Pages for screenshots.

Note: the static version will show the built-in playlist data, but the Refresh button needs `server.py`. GitHub Pages does not run Python servers.

## Files

- `index.html` - page structure
- `styles.css` - Mac OS X / BreakWire visual design
- `script.js` - playlist UI, tabs, clock, visualizer, play links
- `server.py` - local refresh server that reads public Spotify playlist embed data
- `assets/` - local artwork and desktop icons

## Screenshot Tips

- Use `http://localhost:4174/` for the most complete version.
- Refresh the page before taking screenshots so the current playlist data and clock are updated.
- The visible interface intentionally avoids modern platform names to keep the prop period-friendly.
