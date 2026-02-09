
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const saveChatToPdf = async (chatElement: HTMLElement) => {
  if (!chatElement) {
    throw new Error("Chat element not found for PDF generation.");
  }

  // Store original styles to restore them later
  const originalStyles = {
    height: chatElement.style.height,
    maxHeight: chatElement.style.maxHeight,
    overflowY: chatElement.style.overflowY,
    scrollTop: chatElement.scrollTop,
  };

  try {
    // Temporarily modify styles to make the entire content visible for capture
    chatElement.style.height = `${chatElement.scrollHeight}px`;
    chatElement.style.maxHeight = 'none';
    chatElement.style.overflowY = 'visible';
    chatElement.scrollTop = 0;

    const canvas = await html2canvas(chatElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      backgroundColor: window.getComputedStyle(chatElement).backgroundColor,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // A4 page dimensions in mm
    const pdfWidth = 210; 
    const pdfHeight = 297;
    
    const canvasAspectRatio = canvas.width / canvas.height;

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

  } finally {
    // Crucially, restore original styles to return the UI to its normal state
    chatElement.style.height = originalStyles.height;
    chatElement.style.maxHeight = originalStyles.maxHeight;
    chatElement.style.overflowY = originalStyles.overflowY;
    chatElement.scrollTop = originalStyles.scrollTop;
  }
};