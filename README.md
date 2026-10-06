# Perangkap Minyak — two web concepts

Two complete website directions for **Kualiti Alam Hijau (M) Sdn Bhd**, a
Malaysian grease trap manufacturer. Twenty-three pages each, English and
Bahasa Melayu, built on one shared data layer.

**Live:** https://23f3000111.github.io/perangkap-minyak-concepts/

| | |
|---|---|
| [Concept C — Trade Counter](Site-C-Catalogue/) | A trade catalogue. Filterable grid, enquiry list instead of a cart, scroll-scrubbed cutaway of the three chambers. |
| [Concept D — Waterline](Site-D-Waterline/) | Navy ground and a photographic hero, assembled from a fixed kit of twenty-four blocks. Twenty-seven pages, an on-page PDF library, and its own check harness. |

## How it is built

No build step, no dependencies, no framework. Open any `.html` file and it
runs, from a server or from `file://`.

```
assets/
  data/      site.js, catalog.js   the whole content layer, EN + BM
             library.js            Concept D's October additions, see below
  js/        core.js               language, forms, lightbox, nav, boot
             motion.js             reveals, scenes, split type, odometers
             frames.js             the image policy (see below)
             enquiry.js            the enquiry list
             chat.js               the assistant
  css/       motion.css            shared primitives
             chat.css              the assistant panel, themed by the host
  img/                             photography, artwork, certificates
  docs/                            catalogue and drawing PDFs per model,
                                   with thumbnails and page images
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

### Concept D: the October additions

Built from the client's October folder: the GreaseGo slide deck, sixteen
field installation sheets, and a catalogue plus a drawing & installation
guide PDF for every model. The new copy lives in `assets/data/library.js`,
which only Concept D loads, so Concept C is unchanged.

- **Services** opens on the three common issues, under-sink, centralized and
  oil interceptor, each with the complaints, the cause, the fix and the
  client's own sheets.
- **GreaseGo Oil Interceptor**, **Scheduled Waste Guide** (sell or pay, and
  the penalties) and **Cleaning Range** (32 products) are new pages.
- **FAQs**: 21 questions in five topics, reached from the Company menu, the
  footer and the bottom of the home page.
- **Brochures & Downloads** is a real library. Every model's PDFs open in an
  on-page viewer with Download; a phone, which cannot show a PDF inside a
  page, gets the same dialog with each page as an image.
- **Project Gallery** leads with the field sheets, captioned by model and site.

The Section 34B penalty follows the Environmental Quality (Amendment) Act 2024,
in force from 7 July 2024 (RM100,000 to RM10 million and up to five years),
rather than the older RM500,000 figure on the supplied slide.

### Checks

Concept D carries a harness of 100 assertions covering the block kit, the
chassis, routing, the PDF viewer and every rendered page, and a Node script
that confirms every image and PDF the site names is on disk:

```
Site-D-Waterline/checks.html
node Site-D-Waterline/tools/check-assets.js
```

## Notes

- Content is drawn from the company's own published material.
- These are design concepts. The enquiry form and the assistant acknowledge
  locally; there is no server behind them.
- The Site A and Site B concepts, and the source video files, are not part of
  this repository.
