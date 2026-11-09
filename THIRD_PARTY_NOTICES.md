# Third-party engines

- pptx-browser — MIT, https://github.com/bowespublishing/pptx-browser
- docx-preview — Apache-2.0, https://github.com/VolodymyrBaydalka/docxjs
- html2canvas — MIT, https://github.com/niklasvh/html2canvas
- pdf-lib — MIT, https://github.com/Hopding/pdf-lib
- pdfjs-dist — Apache-2.0, https://github.com/mozilla/pdf.js
- mammoth — BSD-2-Clause, https://github.com/mwilliamson/mammoth.js

BentoPDF was consulted as an architecture reference, not included as a dependency.
See docs/engine-review.md for the reviewed revision and scope.

- @neslinesli93/qpdf-wasm — ISC wrapper; QPDF — Apache-2.0.
  Sources: https://github.com/neslinesli93/qpdf-wasm and https://github.com/qpdf/qpdf
  Unmodified runtime copied from the npm package by scripts/prepare-qpdf.mjs.
