# 🔀 Privacy Redirector

[![test instances](https://github.com/bradenglund/privacy-redirector/actions/workflows/testInstances.yml/badge.svg)](https://github.com/bradenglund/privacy-redirector/actions/workflows/testInstances.yml)
[![GitHub](https://img.shields.io/github/license/bradenglund/privacy-redirector?style=flat-square)](./LICENSE)

A userscript that redirects social media platforms to privacy-respecting frontends
(Nitter for Twitter, Invidious for YouTube, etc.). Works with any userscript manager
(Tampermonkey, Violentmonkey, Greasemonkey) and with Safari content blockers like
wBlock on iOS.

A fork of [dybdeskarphet/privacy-redirector](https://github.com/dybdeskarphet/privacy-redirector)
with auto-updated instances from [libredirect/instances](https://github.com/libredirect/instances).

## ⚙️ Installation

1. Install a userscript manager:
   - [Violentmonkey](https://violentmonkey.github.io/) (Edge, Chrome, Firefox)
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox)
   - [wBlock](https://apps.apple.com/app/wblock/id1631328159) (Safari on iOS)

2. Click to install: [privacy-redirector.user.js](https://raw.githubusercontent.com/bradenglund/privacy-redirector/main/privacy-redirector.user.js)

## 🔍 Usage

Visit a supported platform and you'll be automatically redirected to a random
working instance of the privacy-respecting frontend. Instances are sourced from the
[libredirect project](https://github.com/libredirect/instances) and automatically
updated via GitHub Actions.

## ⚙️ Configuration

Edit the values at the top of the script to enable/disable redirects per platform:

```javascript
let twitter = true;   // redirect is enabled
let youtube = false;  // redirect is disabled
```

You can also change your preferred frontend for platforms that support multiple
options:

```javascript
let youtubeFrontend = "invidious"; // "invidious", "piped", "tubo", "freetube"
let redditFrontend = "libreddit";  // "libreddit", "teddit"
```

## 🔄 Automatic Instance Updates

Every Monday, a GitHub Actions workflow fetches the latest instance list from
[libredirect/instances](https://github.com/libredirect/instances) and opens a pull
request with any changes. The existing CI workflow then validates all instance URLs
are reachable. This means your redirects always use fresh, working instances without
manual updates.

## 🔥 Supported Platforms

- Bandcamp → [Tent](https://forgejo.sny.sh/sun/Tent)
- Deepl → [Mozhi](https://codeberg.org/aryak/mozhi)
- DeviantArt → [SkunkyArt](https://git.macaw.me/skunky/SkunkyArt)
- Fandom → [Breezewiki](https://breezewiki.com/)
- Genius → [dumb](https://github.com/rramiachraf/dumb), [Intellectual](https://github.com/Insprill/intellectual)
- Goodreads → [BiblioReads](https://github.com/nesaku/BiblioReads)
- Google Translate → [Lingva Translate](https://github.com/rsmt/lingva-translate), [Mozhi](https://codeberg.org/aryak/mozhi)
- Google → [Librey](https://github.com/Ahwxorg/librey/), [SearX](https://github.com/searx/searx), [SearXNG](https://github.com/searxng/searxng)
- Hacker News → [Worker](https://github.com/worker-tools/worker-news), [Better](https://github.com/vedantnn71/better-hackernews)
- IMDb → [libremdb](https://github.com/zyachel/libremdb)
- Imgur → [rimgo](https://codeberg.org/rimgo/rimgo)
- Instagram → [Proxigram](https://codeberg.org/ThePenguinDev/Proxigram)
- Medium → [Scribe](https://sr.ht/~edwardloveall/Scribe/), [LibMedium](https://github.com/realaravinth/libmedium), [medium.rip](https://github.com/SphericalKat/medium.rip)
- Pinterest → [Binternet](https://github.com/Ahwxorg/Binternet)
- Pixiv → [PixivFE](https://codeberg.org/vnpower/pixivfe)
- Quora → [Quetre](https://github.com/zyachel/quetre)
- Reddit → [Libreddit](https://github.com/libreddit/libreddit), [Teddit](https://codeberg.org/teddit/teddit)
- Reuters → [Neuters](https://github.com/HookedBehemoth/neuters)
- SoundCloud → [Tubo](https://github.com/migalmoreno/tubo)
- Stack Overflow → [AnonymousOverflow](https://github.com/httpjamesm/AnonymousOverflow)
- TikTok → [ProxiTok](https://github.com/pablouser1/ProxiTok)
- Tumblr → [Priviblur](https://github.com/syeopite/priviblur)
- Twitch → [SafeTwitch](https://codeberg.org/SafeTwitch/safetwitch)
- Twitter → [Nitter](https://github.com/zedeus/nitter)
- Wikipedia → [Wikiless](https://codeberg.org/orenom/wikiless)
- YouTube Music → [Piped](https://github.com/TeamPiped/Piped), [Invidious](https://github.com/iv-org/invidious), [Hyperpipe](https://codeberg.org/Hyperpipe/Hyperpipe)
- YouTube → [Piped](https://github.com/TeamPiped/Piped), [Invidious](https://github.com/iv-org/invidious), [Tubo](https://github.com/migalmoreno/tubo)

## ❓ FAQ

- **How can I disable some redirections?**

  Edit the values at the top of the script. Change the value to `false` for the
  platforms you want to disable. A little familiarity with JavaScript syntax should
  be enough.

- **Why does scribe.rip not redirect to user pages?**

  "It's intentional that there is no way to browse content from a user, see popular
  posts, consume via an RSS feed, or further engage with an article via comments or
  "claps".I want to spend my time encouraging writers to move to worthy platforms,
  not making a bad platform worthy."
  ~ [edwardloveall](https://sr.ht/~edwardloveall/Scribe/#project-goals)

- **How often are instances updated?**

  Instance lists are fetched from [libredirect/instances](https://github.com/libredirect/instances)
  every Monday via GitHub Actions. If there are changes, a pull request is created
  automatically, and the CI workflow validates all URLs are reachable.

## 🫂 Credits

- [dybdeskarphet](https://github.com/dybdeskarphet) for the original Privacy Redirector
- [Libredirect](https://github.com/libredirect/browser_extension) for instance data
  and Bandcamp redirection logic

## 📜 License

This project is licensed under the GPL-3.0 license — see the [LICENSE](LICENSE) file for details.
