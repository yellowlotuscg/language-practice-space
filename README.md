# Language Practice Space

A standalone local-first language practice app separated from a larger product prototype.

This repository contains only the public language-learning surface: phrase packs, pronunciation notes, saved local practice answers, and future language-coach work. Private product architecture and operating details are intentionally excluded.

## Current scope

- Spanish, Mandarin, and Korean starter phrase packs
- Literal and natural translations
- Pronunciation/romanization notes
- Local-only saved answers using browser localStorage
- No backend required

## Run locally

Open `index.html` directly, or run:

```bash
python3 -m http.server 8088
```

Then visit:

```text
http://127.0.0.1:8088
```
