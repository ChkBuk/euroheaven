# Hero video

Drop your hero video file here as **`hero.mp4`** (and optionally `hero.webm` for smaller files in modern browsers).

## Recommended specs

| Attribute | Value |
|---|---|
| Filename | `hero.mp4` (and optionally `hero.webm`) |
| Duration | 10–15 seconds, seamless loop |
| Resolution | 1920×1080 (1080p) |
| Codec | H.264 (mp4) / VP9 (webm) |
| Bitrate | 2–4 Mbps |
| File size | < 5 MB ideally |
| Audio | None (the player is muted by default) |
| Content | Mechanic working under a Mercedes-Benz, e.g. an oil change |

## Where to source one

- **Pexels** (free, CC0): https://www.pexels.com/search/videos/mechanic/
- **Pixabay** (free): https://pixabay.com/videos/search/car%20repair/
- **Coverr**: https://coverr.co/

Search terms: *"mechanic under car"*, *"oil change"*, *"car repair"*.

## How it falls back

If `hero.mp4` is missing, the hero shows the poster image instead — no broken playback. The page still looks great.

To change the poster image, edit `src/components/HeroVideo.tsx`.
