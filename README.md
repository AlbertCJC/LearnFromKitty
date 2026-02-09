# Learn from Kitty 🐱

**Learn from Kitty** is a smart, AI-powered study assistant designed to help you learn more effectively from your own materials. Just upload your notes, documents, or paste text, and start a conversation with Kitty, your personal AI tutor.

![Learn from Kitty Screenshot](https://storage.googleapis.com/project-screenshots/learn-from-kitty-demo.png)

## ✨ Features

- **Multi-Format Upload**: Supports various file types including `.pdf`, `.docx`, `.pptx`, and `.txt`.
- **Direct Text Input**: Paste your study notes directly into the application.
- **Conversational Learning**: Engage in an interactive chat with an AI that understands the context of your materials.
- **Focused Responses**: The AI is instructed to answer questions *only* based on the documents you provide, ensuring accurate and relevant study help.
- **Save Your Sessions**: Export your entire chat conversation to a PDF for later review.
- **Sleek & Responsive UI**: A clean, modern interface that works beautifully on any device.
- **Light & Dark Modes**: Switch between themes for comfortable viewing, day or night.

## 🛠️ How It Works

The application operates entirely on the client-side:

1.  **Provide Context**: You upload files or paste text. The app uses powerful JavaScript libraries (`pdf.js`, `mammoth.js`, `jszip`) to parse these files directly in your browser, keeping your data private.
2.  **Start Chatting**: The extracted text is sent as a comprehensive context within the system prompt to the AI model.
3.  **Get Answers**: When you ask a question, your query and the chat history are sent to the Cerebras API. The AI, "Kitty," generates a response based strictly on the context provided, preventing it from using external knowledge.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI Model**: [Cerebras](https://www.cerebras.net/c-3) `llama-3.3-70b` model
- **Client-Side File Parsing**:
  - `pdfjs-dist` for PDF files.
  - `mammoth.js` for DOCX files.
  - `jszip` for PPTX files.
- **PDF Generation**: `jspdf` & `html2canvas`
- **Module Loading**: ES Modules served via `esm.sh` (no local `node_modules` folder needed).

## 🏃 Getting Started

You can run this project locally with just a few steps.

### Prerequisites

- A modern web browser.
- A free API key from [Cerebras](https://www.cerebras.net/c-3).
- [Vite](https://vitejs.dev/) installed globally to serve the project and manage environment variables.
  ```bash
  npm install -g vite
  ```

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/learn-from-kitty.git
    cd learn-from-kitty
    ```

2.  **Configure your API Key:**
    The application needs your Cerebras API key to function.

    - Create a new file named `.env` in the root of the project directory.
    - Add your API key to this file like so:
      ```
      VITE_CEREBRAS_API_KEY='YOUR_API_KEY_HERE'
      ```
    - Replace `'YOUR_API_KEY_HERE'` with your actual key. The `VITE_` prefix is important for the Vite development server to expose it to the application.

3.  **Run the development server:**
    Open your terminal in the project root and run:
    ```bash
    vite
    ```
    Vite will start a local server and provide you with a URL (usually `http://localhost:5173`). Open this URL in your browser to use the app.

## 📂 Project Structure

```
/
├── components/         # Reusable React components (UI elements, icons)
│   ├── icons/          # SVG icon components
│   ├── ChatInterface.tsx # The main chat view
│   ├── MaterialInput.tsx # The initial screen for text/file input
│   └── ...
├── contexts/           # React context providers (e.g., ThemeContext)
├── services/           # API communication layer (cerebrasService.ts)
├── types/              # TypeScript type definitions
├── utils/              # Helper functions (file parsing, PDF generation)
├── App.tsx             # Main application component and layout
├── index.html          # The entry point of the application
└── index.tsx           # The root of the React application
```

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

- **Name:** John Albert Carbajal
- **GitHub:** [@AlbertCJC](https://github.com/AlbertCJC)
- **Portfolio:** 
