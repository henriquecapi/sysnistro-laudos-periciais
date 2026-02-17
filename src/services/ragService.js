const fs = require('fs');
const path = require('path');
const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
// In a real app, use a VectorStore like HNSWLib or Faiss. 
// For this MVP, we might simple search or just mock it if dependencies are heavy.
// We will try to implement a simple in-memory search for the prototype.

const KNOWLEDGE_DIR = path.join(__dirname, '../../data/knowledge');

let loadedDocs = [];

exports.loadDocuments = async () => {
    try {
        console.log("Loading documents from:", KNOWLEDGE_DIR);

        // Ensure directory exists
        if (!fs.existsSync(KNOWLEDGE_DIR)) {
            fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
        }

        const loader = new DirectoryLoader(KNOWLEDGE_DIR, {
            ".txt": (path) => new TextLoader(path),
            ".pdf": (path) => new PDFLoader(path),
        });

        const docs = await loader.load();

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        loadedDocs = await splitter.splitDocuments(docs);
        console.log(`Loaded ${loadedDocs.length} chunks.`);

    } catch (error) {
        console.error("Error loading documents:", error);
    }
};

exports.searchComponents = async (query) => {
    // Naive search implementation for MVP (Keyword matching)
    // In production, use embeddings and cosine similarity.
    if (loadedDocs.length === 0) await exports.loadDocuments();

    const results = loadedDocs.filter(doc =>
        doc.pageContent.toLowerCase().includes(query.toLowerCase())
    );

    // Return top 1 chunk only for faster processing
    return results.slice(0, 1).map(d => d.pageContent.substring(0, 500)).join('\n\n---\n\n') || "Nenhuma informação relevante encontrada na base.";
};
