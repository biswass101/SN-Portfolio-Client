import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

const PAGES = ['/', '/about', '/experience', '/projects', '/contact'];
const PAGE_LABELS = ['Home', 'About', 'Experience', 'Projects', 'Contact'];

function createOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'pdf-download-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 99999;
    background: rgba(0,0,0,0.88);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 16px; color: white; font-family: Inter, sans-serif;
  `;
  overlay.innerHTML = `
    <div style="width:48px;height:48px;border:3px solid rgba(255,255,255,0.2);border-top-color:white;border-radius:50%;animation:spin 1s linear infinite"></div>
    <p id="pdf-status" style="font-size:16px;font-weight:500;">Preparing PDF...</p>
    <p id="pdf-progress" style="font-size:13px;opacity:0.7;">Capturing pages</p>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

function updateOverlay(status: string, progress: string) {
  const s = document.getElementById('pdf-status');
  const p = document.getElementById('pdf-progress');
  if (s) s.textContent = status;
  if (p) p.textContent = progress;
}

function removeOverlay() {
  document.getElementById('pdf-download-overlay')?.remove();
}

function waitForContent(timeout = 4000): Promise<void> {
  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
      if (skeletons.length === 0 || Date.now() - start > timeout) {
        setTimeout(resolve, 300);
      } else {
        requestAnimationFrame(check);
      }
    };
    setTimeout(check, 600);
  });
}

function forceAllVisible() {
  const style = document.createElement('style');
  style.id = 'pdf-force-visible';
  style.textContent = `
    [style*="opacity: 0"], [style*="opacity:0"] {
      opacity: 1 !important;
      transform: none !important;
    }
    * {
      animation-play-state: paused !important;
      transition: none !important;
    }
    .text-gradient {
      -webkit-background-clip: unset !important;
      background-clip: unset !important;
      background: none !important;
      color: #1a3a5c !important;
    }
  `;
  document.head.appendChild(style);
}

function removeForceVisible() {
  document.getElementById('pdf-force-visible')?.remove();
}

export async function downloadWebsiteAsPdf(navigate: (to: string) => Promise<void>) {
  const overlay = createOverlay();
  const originalPath = window.location.pathname;
  const captures: HTMLCanvasElement[] = [];

  try {
    for (let i = 0; i < PAGES.length; i++) {
      updateOverlay(`Capturing: ${PAGE_LABELS[i]}`, `Page ${i + 1} of ${PAGES.length}`);

      await navigate(PAGES[i]);
      await waitForContent();

      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 200));

      forceAllVisible();
      await new Promise((r) => setTimeout(r, 100));

      const root = document.getElementById('root');
      if (!root) continue;

      const fullHeight = Math.max(
        root.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );

      const canvas = await html2canvas(root, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#F2EFE9',
        logging: false,
        width: 1280,
        height: fullHeight,
        windowWidth: 1280,
        windowHeight: fullHeight,
        scrollX: 0,
        scrollY: 0,
        ignoreElements: (el) => el.id === 'pdf-download-overlay',
      });

      removeForceVisible();
      captures.push(canvas);
    }

    updateOverlay('Generating PDF...', 'Combining all pages');

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < captures.length; i++) {
      if (i > 0) pdf.addPage();

      const canvas = captures[i];
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const canvasAspect = canvas.height / canvas.width;
      const imgWidth = pageWidth;
      const imgHeight = imgWidth * canvasAspect;

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        const totalSlices = Math.ceil(imgHeight / pageHeight);
        for (let p = 0; p < totalSlices; p++) {
          if (p > 0) pdf.addPage();

          const sourceY = (p * pageHeight / imgHeight) * canvas.height;
          const sourceHeight = Math.min(
            (pageHeight / imgHeight) * canvas.height,
            canvas.height - sourceY
          );

          const sliceCanvas = document.createElement('canvas');
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = sourceHeight;

          const ctx = sliceCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(
              canvas,
              0, sourceY, canvas.width, sourceHeight,
              0, 0, sliceCanvas.width, sliceCanvas.height
            );
          }

          const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.95);
          const sliceAspect = sliceCanvas.height / sliceCanvas.width;
          pdf.addImage(sliceData, 'JPEG', 0, 0, imgWidth, imgWidth * sliceAspect);
        }
      }
    }

    pdf.save('Syed_Nayeem_Hossain_Portfolio.pdf');
  } catch (err) {
    console.error('PDF generation failed:', err);
  } finally {
    removeForceVisible();
    await navigate(originalPath);
    await new Promise((r) => setTimeout(r, 300));
    removeOverlay();
  }
}
