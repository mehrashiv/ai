# RAG Starter - Tech Support Chatbot

A Retrieval Augmented Generation (RAG) system built with n8n that creates an intelligent chatbot for technical support. The system automatically ingests documentation from Google Drive and provides AI-powered responses using a vector database for context-aware answers.

## 🎯 Project Overview

This project demonstrates a complete RAG pipeline that:
- **Automatically ingests** markdown documents from Google Drive
- **Processes and embedds** documents using OpenAI embeddings
- **Stores vectors** in Supabase vector database
- **Provides intelligent chat** interface with memory and context retrieval
- **Maintains conversation history** with PostgreSQL chat memory

## 🏗️ Architecture

The system consists of two main workflows:

### 1. Document Ingestion Pipeline
- **Google Drive Trigger** - Monitors folder for new documents
- **File Processing** - Downloads and extracts text from files
- **Embedding Generation** - Creates vector embeddings using OpenAI
- **Vector Storage** - Stores embeddings in Supabase vector database

### 2. Chat Interface
- **Chat Trigger** - Handles incoming user messages
- **AI Agent** - Powered by GPT-4 with system prompts
- **Vector Retrieval** - Searches relevant documents using similarity
- **Memory Management** - Maintains conversation context
- **Response Generation** - Provides contextual answers

## 🛠️ Tech Stack

- **Workflow Orchestration**: n8n
- **Language Model**: OpenAI GPT-4.1 Mini
- **Embeddings**: OpenAI text-embedding-ada-002
- **Vector Database**: Supabase Vector Store
- **Memory**: PostgreSQL Chat Memory
- **File Storage**: Google Drive
- **Document Processing**: Built-in text extraction

## ⚙️ Key Components

### AI Agent Configuration
- **System Message**: Expert tecnical knowledge base assistant
- **Retrieval Mode**: Uses vector store as tool with top-20 results
- **Response Constraints**: Only answers questions within knowledge base
- **Fallback**: Polite refusal for out-of-scope questions

### Vector Store Setup
- **Table**: `documents` in Supabase
- **Retrieval**: Top-20 most similar documents
- **Mode**: Retrieve-as-tool for the AI agent
- **Embeddings**: OpenAI embeddings for both ingestion and retrieval

### Memory Management
- **Type**: PostgreSQL chat memory
- **Purpose**: Maintains conversation context across sessions
- **Integration**: Connected to AI agent for personalized responses

## 🚀 Features

- ✅ **Automated Document Ingestion**: New files in Google Drive automatically processed
- ✅ **Intelligent Retrieval**: Vector similarity search for relevant context
- ✅ **Conversational Memory**: Remembers previous interactions
- ✅ **Scoped Responses**: Only answers questions within knowledge base
- ✅ **Real-time Processing**: Immediate document availability after upload
- ✅ **Scalable Architecture**: Can handle large document collections

## 📁 Project Structure

```
RAG Starter/
├── n8n-workflow.json          # Complete workflow definition
├── README.md                  # This documentation
```

## 🔧 Setup Instructions

### Prerequisites
- n8n instance (cloud or self-hosted)
- OpenAI API key
- Supabase account with vector extensions enabled
- Google Drive API access
- PostgreSQL database for chat memory

## 📚 Usage

### Adding Knowledge Base Content
1. Upload markdown files to the configured Google Drive folder
2. Files are automatically processed and indexed
3. New content becomes immediately searchable

### Chatting with the Bot
1. Access the chat interface via webhook URL
2. Ask questions about topics in the knowledge base
3. Receive contextual, accurate responses with conversation memory

### Sample Interactions
```
User: "What is 802.1X"
Bot: [Retrieves relevant documentation and provides comprehensive answer]

User: "How do I configure authentication?"
Bot: [Searches knowledge base for authentication guides and responds]

User: "What's the weather like?"
Bot: "Apologies, I cannot assist you with this question"
```

## 🔍 Technical Details

### Embedding Strategy
- **Model**: OpenAI text-embedding-ada-002
- **Dimension**: 1536 dimensions
- **Similarity**: Cosine similarity for retrieval
- **Top-K**: 20 most relevant documents

### Response Generation
- **Model**: GPT-4.1 Mini for cost-effectiveness
- **Context**: Retrieved documents + conversation history
- **Constraints**: Strict adherence to knowledge base scope
- **Memory**: Persistent across user sessions

## 🎯 Learning Outcomes

This project demonstrates:
- **RAG Architecture**: Complete implementation of retrieval-augmented generation
- **Vector Databases**: Practical use of embeddings and similarity search
- **Workflow Automation**: n8n for complex AI pipeline orchestration
- **API Integration**: Multiple service integration (OpenAI, Supabase, Google Drive)
- **Conversational AI**: Memory management and context-aware responses
- **Document Processing**: Automated ingestion and text extraction

---

**Note**: This project is part of my AI learning journey, demonstrating practical implementation of modern AI techniques including vector databases, embeddings, and conversational AI systems.