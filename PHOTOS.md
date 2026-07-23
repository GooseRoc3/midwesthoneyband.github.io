# Photo naming and workflow

One convention, used identically in Google Drive and in this repo. If a file is
dragged into a text message or emailed to a venue, its name alone should say
what it is.

## File names

```
YYYY-MM-DD-<venue>-NN.jpg
```

Example: `2026-05-06-phyllis-01.jpg`

- **Date** is the date of the gig, not the date of the shoot or the export.
  It matches the `data-date` attribute on the show's row in `index.html`.
- **Venue** is the short slug from the table below — lowercase, no spaces,
  no apostrophes.
- **NN** is a two-digit sequence. Keep the numbers the photographer gave you.
  Gaps are fine and expected: the current Phyllis' set runs 01, 02, 04, 05,
  06, 07 because 03 wasn't a keeper. Don't renumber to close a gap — the
  number is how you ask a photographer to re-export a specific frame.
- Lowercase `.jpg`, always.

## Venue slugs

| Venue | Slug |
|---|---|
| Phyllis' Musical Inn | `phyllis` |
| Harrigan's | `harrigans` |
| Lakeview Porchfest | `lakeview` |
| Weeds Tavern | `weeds` |
| Montrose Saloon | `montrose` |

Add a row when you play somewhere new. Keep slugs short and obvious; once a
slug is used in a filename it is permanent, so don't rename it later.

## Drive folders

```
G:\My Drive\
├── Gigs\
│   └── YYYY-MM-DD Venue Name\
│       ├── Photos\
│       │   ├── raw\        as-received from the photographer, full resolution
│       │   └── web\        resized copies, these get committed to the repo
│       └── Videos\
├── Press Kit\              logos and brand assets, bio, stage plot, one-sheet
│   ├── Band Photos\        member portraits used on band.html
│   └── Friends\
├── Admin\                  contracts, invoices, setlists
└── Inbox\                  anything not yet sorted — drain it monthly
```

Folder names are date-first (`2026-05-06 Phyllis Musical Inn`) so they sort
chronologically. The folder name may keep spaces and readable capitalization;
only the *files* use the slug form.

Renaming or moving a file in Drive does **not** break a share link — Drive
keys on file ID, not path. Copying a file *does* mint a new ID and a new link.

## Per-gig workflow

1. Photographer sends files → drop them in `Gigs/<date venue>/Photos/raw/`,
   renamed to the convention. Nothing here is published automatically, so
   keep the full set.
2. Pick the keepers → resize to ~1600px on the long edge, ~200 KB each, save
   to `web/`.
3. Copy those into `images/gallery/` in this repo.
4. Add a block to the `gigs:` list at the top of `photos.html` (newest first),
   listing each photo and its alt text.
5. If any shot beats what's on the homepage, swap it into the `gallery-grid`
   in `index.html` — that grid stays at 6-9 photos, best-of only.

The site links to no external album, so everything the public sees is what you
put in step 4. If you want to hand someone the full set — a venue, a promoter,
a fan who asks — share the gig's `raw/` folder as *Anyone with the link →
Viewer* and send the link directly. **Test any such link in an incognito
window first:** a link that works while you're signed in as the owner often
shows everyone else a "Request access" wall.

## Friends of the Band

Friends are edited in the front matter at the top of `band.html` — one YAML
block per person, no HTML. Add someone by copying a block and filling in the
fields; the order in the file is the order on the page.

Their photo goes in `Press Kit/Friends/` in Drive, with a web copy in
`images/friends/` in the repo. The card frame is **square**, so crop to a
square (~800x800, ~150 KB) before export — a tall or wide photo gets
center-cropped and usually loses the top of someone's head.

## Size budget

Web copies target ~200 KB. The whole `images/` tree was 2.7 MB at six photos;
at four gigs a year and six web copies each, staying under the budget keeps
the site fast. Full-resolution files live in Drive, never in git.
