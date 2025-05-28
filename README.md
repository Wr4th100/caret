# Caret ✍️  
AI-powered document editor with completions, fact checking, and more—like Cursor, but built from scratch.

## 🧠 What is Caret?

Caret is a smart document editor that brings AI directly into your writing workflow. Inspired by [Cursor](https://www.cursor.so/), Caret gives you intelligent autocompletions, tab-triggered suggestions, and built-in fact checking—perfect for writing essays, research papers, blog posts, or anything that needs clarity and credibility.

## ✨ Features

- **AI Completions**: Get in-place text suggestions while you type  
- **Tab Completion**: Press `Tab` to accept sentence or phrase suggestions  
- **Fact Checker**: Select text and verify it instantly using real-time AI search  
- **Floating Toolbar**: Contextual UI for quick actions (formatting, AI tools, etc.)  
- **Autosave**: Your work is saved automatically using React Query and Supabase/PostgreSQL  
- **Fast, minimal UI**: Built for speed and focus, powered by Lexical and Tailwind CSS  

## ⚙️ Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS  
- **Editor**: Lexical (Meta's framework for building rich text editors)  
- **AI**: Perplexity Sonar API (for completions and fact checking)  
- **Database**: Supabase with PostgreSQL + Drizzle ORM  
- **State Management**: React Query (for syncing + autosave)

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/caret-ai.git
cd caret-ai
```
### 2. Install dependencies
```bash
bun install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory and add your Perplexity API key:
```
PERPLEXITY_API_KEY=your_perplexity_api_key
```
### 4. Start the development server
```bash
bun dev
```

🧑‍💻 Author
Built with 💙 by Roshan
