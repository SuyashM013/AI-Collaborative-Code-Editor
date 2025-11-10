# 💻 Code Colab

**Code Colab** is a real-time collaborative code editor built with **Next.js**, **Socket.IO**, and **Gemini AI**.  
It allows multiple users to join a shared coding room, write code together in real time, see each other's cursors, get AI-powered code suggestions, and even request AI code reviews — all inside the browser.

> A blend of **Replit + Google Docs + ChatGPT** — built from scratch.

---

## 🚀 Features

### 🧩 Real-Time Collaboration
- Multiple users can join the same room instantly.
- Live synchronization of code, language, and editor changes.
- Unique colored cursors for each connected user.
- Real-time “user joined” and “user left” notifications.

### ⚙️ Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS  
- **Backend:** Node.js, Express + Socket.IO (custom real-time event handling)  
- **AI:** Google Gemini (for AI suggestions & reviews)  
- **Editor:** Ace Editor (monokai theme, Vim/Emacs modes)  

### 🤖 AI Code Completions
- AI suggests code as you type.
- Accept suggestions using **Tab** key.
- Enable/Disable AI autocomplete with a toggle button.
- Powered by **Gemini 2.5 Flash** for fast, context-aware completions.

### 🧑‍🏫 AI Code Reviewer (Sidebar)
- Toggleable chat-style sidebar.
- Paste or send code snippets for instant AI review.
- Feedback includes:
  - Code quality  
  - Performance insights  
  - Bug & security analysis  
  - Suggested improvements
- Works just like a built-in code mentor!

---

### 🧠 Smart Room Management
- Each session generates a unique **room ID** using `uuid`.
- Auto room synchronization when new users join.
- No manual refresh needed — all changes propagate live.
- Copy room ID with one click to invite others.

---

## 🧰 Tech Overview

| Area | Tools / Libraries |
|------|--------------------|
| **Framework** | Next.js 14 (App Router) |
| **Frontend** | React, Next.js  |
| **Backend** | Node, Express, HTTP Server |
| **Real-time Engine** | Socket.IO |
| **AI Integration** | Gemini 2.5 Flash API |
| **Code Editor** | Ace Editor |
| **Styling** | Tailwind CSS |
| **Notifications** | React Hot Toast |
| **Deployment** | Vercel (Frontend) + Node.js (Backend) |

---

## 🛠️ Installation & Setup

### 1️. Clone the repo
```bash
git clone https://github.com/SuyashM013/AI-Collaborative-Code-Editor
```
### 2️. Install dependencies
```bash
npm install
```

### 3️. Set up environment variables

##### Create a .env.local file in the root directory:
``` bash

NEXT_PUBLIC_WEB_SOCKET_URL=http://localhost:5000 or backend url
GEMINI_API_KEY=your_google_gemini_api_key 

```

### 4️. Start backend server

``` bash
node server.js 
``` 

### 5️. Start Next.js frontend

``` bash
npm run dev
```

### 6️. Open in browser
``` bash
Visit → http://localhost:3000

```
---

🧩 Folder Structure
editor/
├── app/
│   ├── components/
│   │   ├── Room.jsx
│   │   ├── SocketWrapper.jsx
│   │   ├── CodeReview.jsx
│   │   └── JoinRoom.jsx
│   ├── api/
│   │   ├── ai/
│   │   │   ├── suggest/route.js   # AI code suggestion
│   │   │   └── review/route.js    # AI code reviewer
│   └── room/[roomId]/
│       ├── page.js
│       └── RoomPageClient.jsx
├── utils/
│   └── index.js                   # Helper for user color generation
└── server.js                       # Socket.IO backend


---

🎨 UI Preview
Editor View	AI Reviewer Sidebar

	

(Replace with your screenshots after deployment)

---

## 🌍 Deployment

- Frontend: Deploy on Vercel

- Backend: You can deploy Socket.IO server on Render
, Railway
, or any VPS (e.g., EC2)

- Update the WebSocket URL in .env.local for production.

---

## 🧠 Future Enhancements

- 🪄 Code execution (run output in sandbox)

- 💬 Real-time AI chat assistant

- 🔐 User authentication & saved rooms

- 📜 Version control for code history

---

## 👨‍💻 Author

**Suyash Mishra**  
Frontend Developer | AI Innovator | Real-time Systems Enthusiast  

📧 [Mishrasuyash013@gmail.com](mailto:mishrasuyash013@gmail.com)  
🌐 [mishrasuyash013.wixstudio.com/portfolio](https://mishrasuyash013.wixstudio.com/portfolio)  
💼 [www.linkedin.com/in/mishrasuyash013](https://linkedin.com/in/mishrasuyash013)

---

## 💡 Inspiration

Built as a modern developer tool to blend **collaboration + AI**.  
The goal: make real-time coding **smarter, not harder**.  

> “Build tools that make developers feel 10x more creative.”

---

⭐ **If you like this project, don’t forget to star the repo and share it!**
.