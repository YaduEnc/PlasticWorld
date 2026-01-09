# How to View Mermaid Diagrams

This guide explains how to view the architecture diagrams in `ARCHITECTURE_DIAGRAMS.md`.

## 🎯 Quick Methods

### Method 1: GitHub (Easiest)
1. Open `ARCHITECTURE_DIAGRAMS.md` on GitHub
2. Diagrams render automatically - no setup needed!

### Method 2: Mermaid Live Editor
1. Go to https://mermaid.live
2. Open `ARCHITECTURE_DIAGRAMS.md`
3. Copy the code from ONE diagram (between ` ```mermaid ` and ` ``` `)
4. Paste into the editor
5. View the rendered diagram

### Method 3: VS Code
1. Install extension: "Markdown Preview Mermaid Support"
2. Open `ARCHITECTURE_DIAGRAMS.md`
3. Press `Cmd+Shift+V` (Mac) or `Ctrl+Shift+V` (Windows/Linux)
4. Diagrams render in preview

### Method 4: Online Markdown Viewers
- **Dillinger:** https://dillinger.io (supports Mermaid)
- **StackEdit:** https://stackedit.io (supports Mermaid)
- Upload the file and view

## 📋 Individual Diagram Files

If you need individual diagram files, here are the diagram names you can extract:

1. **System Architecture Overview** - Complete system architecture
2. **Authentication Flow** - User sign-in sequence
3. **Token Refresh Flow** - Token refresh sequence
4. **Message Sending Flow** - Message delivery sequence
5. **Message Delivery & Read Receipts** - Read receipt flow
6. **End-to-End Encryption Flow** - Signal Protocol flow
7. **Friendship Management Flow** - Friend request flow
8. **WebSocket Connection & Events** - WebSocket state diagram
9. **Database Schema Relationships** - ER diagram
10. **Real-Time Typing Indicators** - Typing indicator flow
11. **API Request/Response Flow** - Request processing flow
12. **Deployment Architecture** - Production deployment
13. **Security Architecture** - Security layers
14. **Performance Optimization** - Optimization strategies
15. **Complete Message Lifecycle** - Message state diagram
16. **Multi-Device Support** - Multi-device flow

## 🔧 Troubleshooting

**Error: "No diagram type detected"**
- You're trying to render the entire file as one diagram
- Solution: Copy only ONE diagram code block (between ```mermaid and ```)

**Diagrams not rendering:**
- Ensure your viewer supports Mermaid
- Check that code blocks start with ` ```mermaid ` (not just ` ``` `)

**Need to edit diagrams:**
- Use Mermaid Live Editor: https://mermaid.live
- Or use VS Code with Mermaid extension
- Edit the code, then copy back to the markdown file

## 📝 Example: Extracting a Single Diagram

To extract the "System Architecture Overview" diagram:

1. Open `ARCHITECTURE_DIAGRAMS.md`
2. Find the section: `## 📐 System Architecture Overview`
3. Copy everything between:
   ```
   ```mermaid
   graph TB
   ...
   ```
   ```
4. Paste into Mermaid Live Editor
5. View the rendered diagram

---

**Tip:** GitHub automatically renders all diagrams when viewing the file, so that's the easiest method!
