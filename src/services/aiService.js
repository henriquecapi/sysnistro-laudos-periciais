const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const fs = require('fs');
const path = require('path');
const ragService = require('./ragService');

// Load behavior config
const configPath = path.join(__dirname, '../../config/behavior.json');
let behaviorConfig = {
    systemPrompt: "You are a helpful assistant.",
    model: "nvidia/nemotron-nano-9b-v2:free"
};

try {
    const rawConfig = fs.readFileSync(configPath);
    behaviorConfig = JSON.parse(rawConfig);
} catch (e) {
    console.warn("Could not load behavior.json, using defaults.");
}

// Initialize ChatOpenAI with OpenRouter configuration
const chatModel = new ChatOpenAI({
    modelName: behaviorConfig.model,
    openAIApiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Sistema de Laudos Periciais"
        },
        timeout: 30000 // 30 seconds timeout
    },
    maxTokens: 1024,
    temperature: 0.7,
});

exports.processChat = async (userMessage, currentHtml) => {
    try {
        console.log(`Processing chat with OpenRouter (Model: ${behaviorConfig.model})...`);
        if (!process.env.OPENROUTER_API_KEY) {
            throw new Error("OPENROUTER_API_KEY is not set in environment variables.");
        }

        // 1. Search for relevant context in RAG
        console.log("1. Searching RAG context...");
        const context = await ragService.searchComponents(userMessage);
        console.log("✓ RAG context retrieved");

        // 2. Construct Prompt
        console.log("2. Constructing prompt...");
        const systemPrompt = new SystemMessage(
            `${behaviorConfig.systemPrompt}\n\n` +
            `CONTEXTO DA BASE DE CONHECIMENTO:\n${context}\n\n` +
            `HTML ATUAL DO LAUDO:\n${currentHtml}\n\n` +
            `INSTRUÇÕES: Responda ao usuário. Se ele pedir para alterar o laudo, forneça o NOVO HTML completo dentro de uma tag <html_output>...</html_output>. Se for apenas conversa, não use tags especiais.`
        );
        console.log("✓ Prompt constructed");

        // 3. Call OpenRouter API via LangChain
        console.log("3. Calling OpenRouter API...");
        const response = await chatModel.invoke([
            systemPrompt,
            new HumanMessage(userMessage),
        ]);
        console.log("✓ Response received");

        const replyContent = response.content;

        // 4. Parse Response for HTML updates
        let replyText = replyContent;
        let updatedHtml = null;

        const htmlMatch = replyContent.match(/<html_output>([\s\S]*?)<\/html_output>/);
        if (htmlMatch) {
            updatedHtml = htmlMatch[1];
            replyText = replyContent.replace(/<html_output>[\s\S]*?<\/html_output>/, "").trim();
            if (!replyText) replyText = "Laudo atualizado conforme solicitado.";
        }

        return {
            reply: replyText,
            updatedHtml: updatedHtml
        };

    } catch (error) {
        console.error("AI Service Error Detailed:", error);
        return {
            reply: `Erro técnico: ${error.message}`,
            updatedHtml: null
        };
    }
};
