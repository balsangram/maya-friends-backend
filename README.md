# maya-friends-backend

What should our RAG feature do?
User asks a general medicine-information question, and our RAG system retrieves information from a knowledge base before asking the LLM to answer.



"What is paracetamol generally used for?"

User question
      ↓
Create embedding
      ↓
Search medicine knowledge
      ↓
Retrieve relevant information
      ↓
Send retrieved information + question to LLM
      ↓
Generate answer


embedding model used--all-MiniLM-L6-v2