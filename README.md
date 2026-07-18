# SIEM Security Operations Center Lab

A multi-page cybersecurity portfolio showcasing a fully segmented SOC/SIEM home lab —
four isolated VLANs, dual SIEM platforms, live adversary emulation, and custom
detection engineering.

**Designed, built, and documented by Tristen Dennis.**

---

## Structure

```
enterprise-siem-build/
├── index.html            # Home — hero, live terminal, count-up stats
├── diagram.html          # Network diagram + four-VLAN legend
├── hardware.html         # Hardware flip cards
├── software.html         # Software stack (hover table)
├── attacks.html          # Attacks & Detections (expandable cards)
├── detection-rules.html  # Custom Wazuh rules (syntax-highlighted)
├── gallery.html          # Finished build + build-process timeline
└── assets/
    ├── css/styles.css    # Full design system
    ├── js/main.js        # Nav, background, reveals, counters, terminal, lightbox
    └── img/
        ├── logo.svg          # TD monogram (also the favicon)
        ├── placeholder.svg   # Fallback for any missing image
        ├── pc.jpg            # ← your Proxmox host photo (add this)
        ├── network-diagram.png  # ← your updated diagram (add this; .svg also fine)
        └── build/            # ← gallery photos (finished-*.jpg, process-*.jpg)
```

No build step — plain HTML/CSS/JS served directly by GitHub Pages.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Repo **Settings → Pages**.
3. Source: **Deploy from a branch** → branch `main`, folder `/ (root)` → **Save**.
4. Live at `https://tristendennis3.github.io/enterprise-siem-build/`.

## Adding your assets

The layout is already sized for these — drop them in and they appear automatically:

| Asset | Where it goes |
|-------|---------------|
| Proxmox host photo | `assets/img/pc.jpg` |
| Updated network diagram | `assets/img/network-diagram.png` (or `.svg`) |
| Finished-build photos | `assets/img/build/finished-1.jpg` … |
| Build-process photos | `assets/img/build/process-1.jpg` … |

Hardware product shots are referenced from their source URLs; if any ever fails
to load, a clean placeholder is shown automatically instead of a broken image.

## Credits

Fonts: Space Grotesk, Inter, JetBrains Mono (Google Fonts).
Palette, motion, and layout follow the project design specification.
