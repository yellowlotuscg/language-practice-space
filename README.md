# Language Practice Space

A small browser app for practicing one useful sentence at a time in Spanish, Mandarin, or Korean.

You choose a language, read a starter phrase with a pronunciation guide, write a short reply, and compare it with a model answer. Replies you save stay in this browser. The page loads the Inter font from Google Fonts. Asking the DeepSeek coach is the only request the app sends to its own server.

The live site is [https://language.yellowlotuscg.com](https://language.yellowlotuscg.com).

This repository is the public practice surface: phrase packs, pronunciation notes, answers saved on the device, and the coach endpoint. It does not include private product architecture.

## What is in the app

Each language has two starter phrases, written in `app.js`:

- Spanish: a check-in, and a way to ask for a minute to think
- Mandarin: a greeting, and a request to speak more slowly
- Korean: a polite check-in, and a way to say you are practicing

Every phrase shows the original line, a pronunciation guide, the natural meaning, a literal translation, the tone to use, a word-by-word breakdown, and a short coach note. Mandarin and Korean phrases also include a mouth cue.

The page has three steps. Pick a language, read the phrase, then write one reply. You can save that reply, reveal the model answer, or move to the next phrase. The layout and styles live in `index.html` and `style.css`.

Saved replies go into `localStorage` under `language_practice_space_v2`. The app keeps the latest 20 and lists the three most recent on the page.

## Clone

```bash
git clone https://github.com/yellowlotuscg/language-practice-space.git
cd language-practice-space
```

The HTTPS clone URL is `https://github.com/yellowlotuscg/language-practice-space.git`.

## Run locally

From the repository root:

```bash
python3 -m http.server 8088
```

Open [http://127.0.0.1:8088](http://127.0.0.1:8088).

Opening `index.html` directly also loads the practice page, and saving a reply still uses this browser. Either way, the DeepSeek button cannot reach `/api/coach`, so the page keeps what you typed and says the coach is not reachable.

## DeepSeek coach

`functions/api/coach.js` is a Cloudflare Pages Function. The button posts the language, the practice phrase, its natural meaning, the prompt, and your reply to `/api/coach`.

On the live site that function calls Workers AI, model `@cf/deepseek-ai/deepseek-r1-distill-qwen-32b`, through the `AI` binding in `wrangler.toml`. It asks for JSON with a natural version, a short note, and two or three alternatives. If the model is missing or the reply cannot be read, the function returns a short local fallback instead of breaking the page.

`wrangler pages dev .` is the local command for that function. The AI binding asks you to log in to Cloudflare before the dev server finishes starting. You do not need that login to use the phrase practice itself.

## GitHub Pages

GitHub Pages publishes the `main` branch from the repository root. `index.html` is the page it serves. The `CNAME` file sets the custom domain to `language.yellowlotuscg.com`. Leave both files in the root.

[https://yellowlotuscg.github.io/language-practice-space/](https://yellowlotuscg.github.io/language-practice-space/) redirects to that domain. There is no separate Pages build workflow.

## License

[MIT](LICENSE). Copyright (c) 2026 Matthew Coggins.
