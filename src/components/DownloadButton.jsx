import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MARGIN_TOP = 25;   // mm
const MARGIN_SIDE = 18; // mm
const SECTION_GAP = 7; // mm ← distance between sections

export default function DownloadButton({ title }) {

  async function renderBlock(pdf, node, cursor) {
    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const usableWidth = pageWidth - MARGIN_SIDE * 2;
    const imgHeight = (canvas.height * usableWidth) / canvas.width;

    if (cursor.y + imgHeight > pageHeight - MARGIN_TOP) {
      pdf.addPage();
      cursor.y = MARGIN_TOP;
    }

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      MARGIN_SIDE,
      cursor.y,
      usableWidth,
      imgHeight
    );

    cursor.y += imgHeight; // ⬅️ ONLY content height here
  }

  async function renderContainer(pdf, container, headerSelector, sectionSelector) {
    const cursor = { y: MARGIN_TOP };

    // Render header ONCE
    const header = container.querySelector(headerSelector);
    if (header) {
      await renderBlock(pdf, header, cursor);
    }

    const sections = container.querySelectorAll(sectionSelector);

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];

      await renderBlock(pdf, section, cursor);

      // ✅ ADD GAP ONLY BETWEEN SECTIONS
      if (i < sections.length - 1) {
        cursor.y += SECTION_GAP;
      }
    }
  }

  async function downloadPdf() {
    const chordsNode = document.getElementById("print-chords");
    const lyricsNode = document.getElementById("print-lyrics");

    if (!chordsNode || !lyricsNode) {
      alert("Printable content not found");
      return;
    }

    try {
      const pdf = new jsPDF("p", "mm", "a4");

      // Chords + lyrics
      await renderContainer(
        pdf,
        chordsNode,
        ".print-header-block",
        ".print-section"
      );

      // Lyrics-only starts fresh
      pdf.addPage();
      await renderContainer(
        pdf,
        lyricsNode,
        ".lyrics-header-block",
        ".lyrics-section"
      );

      pdf.save(`${title}.pdf`);
    } catch (err) {
      console.error(err);
      alert("PDF generation failed. Check console.");
    }
  }

  return <button onClick={downloadPdf}>Download PDF</button>;
}
