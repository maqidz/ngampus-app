declare module 'pptx-browser' {
  export class PptxRenderer {
    slideCount: number;
    load(source: File | Blob | ArrayBuffer | Uint8Array): Promise<void>;
    renderSlide(index: number, canvas: HTMLCanvasElement, width?: number): Promise<void>;
    destroy(): void;
  }
}
