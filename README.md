# Perangkap Minyak — two web concepts

Two complete website directions for **Kualiti Alam Hijau (M) Sdn Bhd**, a
Malaysian grease trap manufacturer. Twenty-three pages each, English and
Bahasa Melayu, built on one shared data layer.

**Live:** https://23f3000111.github.io/perangkap-minyak-concepts/

| | |
|---|---|
| [Concept C — Trade Counter](Site-C-Catalogue/) | A trade catalogue. Filterable grid, enquiry list instead of a cart, scroll-scrubbed cutaway of the three chambers. |
| [Concept D — Waterline](Site-D-Waterline/) | Navy ground and a photographic hero, assembled from a fixed kit of nineteen blocks. Carries its own check harness. |

## How it is built

No build step, no dependencies, no framework. Open any `.html` file and it
runs, from a server or from `file://`.

```
assets/
  data/      site.js, catalog.js   the whole content layer, EN + BM
  js/        core.js               language, forms, lightbox, nav, boot
             motion.js             reveals, scenes, split type, odometers
             frames.js             the image policy (see below)
             enquiry.js            the enquiry list
             chat.js               the assistant
  css/       motion.css            shared primitives
             chat.css              the assistant panel, themed by the host
  img/                             photography, artwork, certificates
Site-C-Catalogue/
Site-D-Waterline/
```

Each site is thin HTML shells plus one `js/site.js` that renders every page,
so the chassis cannot drift apart across twenty-three files.

### The image policy

About half the supplied library is not photography — product artwork, project
plates, certificates, council crests and installation diagrams all carry words
printed into the picture, and a cover crop cuts those words in half.

`assets/js/frames.js` decides by source, not by slot: `PM.showsWhole(path)`
returns whether a file carries text, and anything that does is shown whole on
a plate. The photographs mixed into those folders are named explicitly, each
one checked against the file rather than the filename.

### The assistant

`assets/js/chat.js` takes a name, mobile and email, then sizes a trap against
the real seventeen-model table, assembles a quotation request, books a service
visit, or answers from the FAQ — in either language. Nothing is transmitted:
every answer is derived locally and the handoff is WhatsApp.

It never invents a ringgit figure. This business quotes rather than publishes
prices, so a made-up number would be the one thing a buyer could not check.

### Checks

Concept D carries a harness of 75 assertions covering the block kit, the
chassis, routing and every rendered page:

```
Site-D-Waterline/checks.html
```

## Notes

- Content is drawn from the company's own published material.
- These are design concepts. The enquiry form and the assistant acknowledge
  locally; there is no server behind them.
- The Site A and Site B concepts, and the source video files, are not part of
  this repository.
