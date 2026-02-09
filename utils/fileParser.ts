
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import JSZip from 'jszip';

// Set worker source for pdfjs to ensure it works correctly in this environment
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@4.5.136/build/pdf.worker.mjs`;

async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
    fullText += pageText + '\n\n';
  }
  return fullText;
}

async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function parsePptx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const slideFiles = Object.keys(zip.files).filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'));
  
  let fullText = '';
  const parser = new DOMParser();

  for (const slideFile of slideFiles) {
    const slideContent = await zip.file(slideFile)?.async('string');
    if (slideContent) {
      const xmlDoc = parser.parseFromString(slideContent, 'application/xml');
      const textNodes = xmlDoc.getElementsByTagName('a:t');
      for (let i = 0; i < textNodes.length; i++) {
        if (textNodes[i].textContent) {
          fullText += textNodes[i].textContent + ' ';
        }
      }
      fullText += '\n\n';
    }
  }
  return fullText;
}

function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export async function parseFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return parsePdf(file);
    case 'docx':
      return parseDocx(file);
    case 'pptx':
      return parsePptx(file);
    case 'txt':
    case 'md':
    case 'csv':
      return readTextFile(file);
    case 'doc':
      // Client-side parsing of legacy .doc is unreliable.
      // We will attempt to read it as text and prepend a warning.
      return readTextFile(file).then(content => {
          return `(Note: Parsing for .doc files is limited and may produce strange results. For best accuracy, please re-save the file as .docx.)\n\n${content}`; 
      });
    default:
      throw new Error(`Unsupported file type: .${extension}. Please use .pdf, .docx, .pptx, or .txt.`);
  }
}
