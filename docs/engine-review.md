# Browser engine review

Reference: https://github.com/alam00000/bentopdf
Reviewed commit: ed197274e906a2d378d7c566b0de88e403321b50 (2026-11-08).

Read: package.json, LICENSE, COMMERCIAL-LICENSE.md, utils/libreoffice-loader.ts,
utils/compress.ts, utils/load-pdf-document.ts, workflow/nodes/powerpoint-to-pdf-node.ts,
logic/scan-to-pdf.ts and image/sign workflow entry points.

BentoPDF is AGPL-3.0-only with commercial licensing. No BentoPDF source or vendor
artifacts were copied. This application uses independently implemented adapters
and separately distributed upstream packages. It does not adopt BentoPDF's
commercial PDFium or hyper-compress artifacts.

## Applied

- Office: lazy-loaded docx-preview and html2canvas (DOCX).
  Each page is rasterized sequentially and embedded with pdf-lib. No WASM assets,
  preparation scripts, SharedArrayBuffer or isolation headers. 20 MB / 50 pages.
- Merge: dedicated worker, transferred byte buffers, form appearance flattened
  before copying pages; reject encrypted/unreadable files instead of bypassing.
- Compression: retain existing raster pipeline plus an explicit text-preserving
  structural mode. Always return original if rewriting would enlarge it.
- Images and scanner: shared bounded raster pipeline, asynchronous blob encoding,
  sequential image handling and explicit canvas/object URL cleanup.
- Sign: trim transparent margins and constrain signature aspect ratio to page, mapping rotated crop boxes correctly.
- Shared input/download: accept validation for drops, 150 MB total input cap,
  disable edits during tasks, clear stale results, delay URL revocation for downloads.
- Translate: removed from homepage per user request. Hidden route retained;
  no replacement translation engine introduced by this review.

## Limits

This is not feature parity with BentoPDF. No OCR, perspective correction, certified
signatures, or PDFium repair is introduced. Office output is raster, not selectable text. Legacy DOC/PPT/ODP are unsupported.
Fonts, charts, SmartArt and pagination can differ. Image-based conversions remain raster PDF. Compression reductions
vary by document; structural compression is not a substitute for qpdf optimization.
