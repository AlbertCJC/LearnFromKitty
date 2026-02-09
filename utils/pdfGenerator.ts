
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const saveChatToPdf = async (chatElement: HTMLElement) => {
  if (!chatElement) {
    throw new Error("Chat element not found for PDF generation.");
  }
  
  // Temporarily make sure the full content is visible for capture
  const originalScrollTop = chatElement.scrollTop;
  chatElement.scrollTop = 0;

  const canvas = await html2canvas(chatElement, {
    scale: 2, // Higher scale for better quality
    useCORS: true,
    scrollY: -window.scrollY,
    backgroundColor: window.getComputedStyle(chatElement).backgroundColor,
  });
  
  // Restore scroll position
  chatElement.scrollTop = originalScrollTop;

  const imgData = canvas.toDataURL('image/png');
  
  // A4 page dimensions in mm
  const pdfWidth = 210; 
  const pdfHeight = 297;
  
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const canvasAspectRatio = canvasWidth / canvasHeight;

  // Calculate image dimensions to fit on the PDF page
  const imgWidth = pdfWidth - 20; // with some margin
  const imgHeight = imgWidth / canvasAspectRatio;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let heightLeft = imgHeight;
  let position = 10; // top margin

  pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
  heightLeft -= (pdfHeight - 20); // page height with margins

  // If the content is longer than one page, add new pages
  while (heightLeft > 0) {
    position = -heightLeft - 10;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= (pdfHeight - 20);
  }

  pdf.save('learn-from-kitty-chat.pdf');
};
