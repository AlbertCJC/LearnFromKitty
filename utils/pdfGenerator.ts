
import jsPDF from 'jspdf';
import { ChatMessage } from '../types';

const LINE_HEIGHT = 7; // in mm, for a font size of 11-12
const MARGIN = 10; // in mm

export const saveChatToPdf = (messages: ChatMessage[]) => {
  if (!messages || messages.length === 0) {
    console.warn("No messages to save.");
    return;
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const usableWidth = pageWidth - 2 * MARGIN;
  let y = MARGIN + 10; // Start position for text, with extra top margin

  // Add a title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Learn from Kitty - Chat Transcript', MARGIN, y);
  y += LINE_HEIGHT * 2;

  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');

  messages.forEach(msg => {
    // Skip the initial greeting message
    if (msg.role === 'assistant' && msg.content === "Hello! I'm your study kitty. Ask me anything about your materials.") {
        return;
    }

    const prefix = msg.role === 'user' ? 'You: ' : 'Kitty: ';
    
    // Set font style based on role
    pdf.setFont('helvetica', msg.role === 'user' ? 'bold' : 'normal');

    const fullText = prefix + msg.content;
    const lines = pdf.splitTextToSize(fullText, usableWidth);

    const textBlockHeight = lines.length * (LINE_HEIGHT * 0.8);

    // Check if there is enough space on the current page for the next message
    if (y + textBlockHeight > pageHeight - MARGIN) {
      pdf.addPage();
      y = MARGIN; // Reset y to the top margin for the new page
    }
    
    pdf.text(lines, MARGIN, y);
    
    // Update y position for the next message block
    y += textBlockHeight + (LINE_HEIGHT / 2); // Add a little extra space between messages
  });

  pdf.save('learn-from-kitty-chat.pdf');
};
