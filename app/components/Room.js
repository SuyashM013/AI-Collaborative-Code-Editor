
"use client";

import { useEffect, useState, useRef } from "react";
import AceEditor from "react-ace";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { generateColor } from "@/app/utils";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";


import "ace-builds/src-noconflict/keybinding-emacs";
import "ace-builds/src-noconflict/keybinding-vim";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";
import ace from "ace-builds/src-noconflict/ace";

import "ace-builds/src-noconflict/snippets/javascript";
import "ace-builds/src-noconflict/snippets/python";
import "ace-builds/src-noconflict/snippets/typescript";
import "ace-builds/src-noconflict/snippets/c_cpp";
import "ace-builds/src-noconflict/snippets/golang";
import "ace-builds/src-noconflict/snippets/java";
import "ace-builds/src-noconflict/snippets/html";
import "ace-builds/src-noconflict/snippets/css";

// import ace from "ace-builds/src-noconflict/ace";
ace.config.set("workerPath", "/ace");


ace.config.set("useWorker", false);
ace.config.set("basePath", "/ace"); // ✅ this path will point to /public/ace
ace.config.set("modePath", "/ace");
ace.config.set("themePath", "/ace");
ace.config.set("workerPath", "/ace");

export default function Room({ socket, roomId, username }) {
  const router = useRouter();
  const editorInstanceRef = useRef(null)
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [fetchedCode, setFetchedCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [codeKeybinding, setCodeKeybinding] = useState(undefined);
  const cursorsRef = useRef({});

  const languagesAvailable = [
    "javascript",
    "java",
    "c_cpp",
    "python",
    "typescript",
    "golang",
    "yaml",
    "html",
  ];

  const codeKeybindingsAvailable = ["default", "emacs", "vim"];

  function onEditorLoad(editor) {
    editorInstanceRef.current = editor;
    console.log("✅ Ace editor initialized:", editor);
  }

  function onChange(newValue) {
    setFetchedCode(newValue);
    socket.emit("update code", { roomId, code: newValue });
    socket.emit("syncing the code", { roomId });
  }

  function handleLanguageChange(e) {
    setLanguage(e.target.value);
    socket.emit("update language", { roomId, languageUsed: e.target.value });
    socket.emit("syncing the language", { roomId });
  }

  function handleCodeKeybindingChange(e) {
    setCodeKeybinding(e.target.value === "default" ? undefined : e.target.value);
  }

  function handleLeave() {
    socket.disconnect();
    router.push("/");
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    toast.success("Room ID copied");
  }



  useEffect(() => {
    if (!socket || !roomId || !username) return;


    const handleUsers = ({ userslist }) => setFetchedUsers(userslist);
    const handleLang = ({ languageUsed }) => setLanguage(languageUsed);
    const handleCode = ({ code }) => setFetchedCode(code);
    const handleJoin = ({ username }) => toast(`${username} joined`);
    const handleLeave = ({ username }) => toast(`${username} left`);

    socket.on("refresh hint", () => {
      //  window.location.reload();
    });

    socket.on("cursor update", ({ username: user, cursor }) => {
      if (user === username) return;
      updateRemoteCursor(user, cursor);
    });

    socket.on("updating client list", handleUsers);
    socket.on("on language change", handleLang);
    socket.on("on code change", handleCode);
    socket.on("new member joined", handleJoin);
    socket.on("member left", handleLeave);

    // 👇 when socket first connects or reconnects, request the latest state
    const requestState = () => socket.emit("request current state", { roomId });
    socket.on("connect", requestState);
    socket.on("reconnect", requestState);

    // and the initial join
    socket.emit("when a user joins", { roomId, username });
    requestState();


    return () => {
      socket.off("updating client list", handleUsers);
      socket.off("on language change", handleLang);
      socket.off("on code change", handleCode);
      socket.off("new member joined", handleJoin);
      socket.off("member left", handleLeave);
      socket.off("connect", requestState);
      socket.off("reconnect", requestState);
    };
  }, [socket, roomId, username]);



  useEffect(() => {
    const editor = editorInstanceRef.current;
    if (!editor) return;

    const selection = editor.getSelection();
    const handleCursorChange = () => {
      const cursor = selection.getCursor();
      socket.emit("cursor move", { roomId, username, cursor });
    };

    selection.on("changeCursor", handleCursorChange);
    return () => selection.off("changeCursor", handleCursorChange);
  }, [socket, roomId, username]);

  // 🧩 Helper to show remote users’ cursors
  function updateRemoteCursor(user, cursor) {
    const editor = editorInstanceRef.current;
    if (!editor) return;
    const session = editor.getSession();
    const Range = ace.require("ace/range").Range;

    // remove old cursor marker and label
    const existing = cursorsRef.current[user];
    if (existing) {
      session.removeMarker(existing.markerId);
      existing.labelEl.remove();
    }

    const color = generateColor(user);
    const range = new Range(cursor.row, cursor.column, cursor.row, cursor.column + 1);
    const markerId = session.addMarker(range, "remote-cursor", true);

    // Create floating name label
    const coords = editor.renderer.textToScreenCoordinates(cursor.row, cursor.column);
    const label = document.createElement("div");
    label.className = "remote-label";
    label.innerText = user;
    label.style.position = "absolute";
    label.style.left = `${coords.pageX + 4}px`;
    label.style.top = `${coords.pageY - 18}px`;
    label.style.background = color;
    label.style.color = "#fff";
    label.style.padding = "2px 6px";
    label.style.borderRadius = "6px";
    label.style.fontSize = "11px";
    label.style.zIndex = 9999;
    label.style.transition = "all 0.1s linear";
    document.body.appendChild(label);

    cursorsRef.current[user] = { markerId, labelEl: label, color };
  }



  return (
    <div className="room flex">
      <div className="roomSidebar p-3 bg-[#1a1a1a] text-white w-60 flex flex-col justify-between">
        <div>
          <select
            className="w-full p-1 rounded bg-gray-800 mb-2"
            value={language}
            onChange={handleLanguageChange}
          >
            {languagesAvailable.map((each) => (
              <option key={each} value={each}>
                {each}
              </option>
            ))}
          </select>

          <select
            className="w-full p-1 rounded bg-gray-800 mb-2"
            value={codeKeybinding || "default"}
            onChange={handleCodeKeybindingChange}
          >
            {codeKeybindingsAvailable.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>

          <p>Connected Users:</p>
          <div className="overflow-y-auto max-h-72">
            {fetchedUsers.map((user) => (
              <div key={user} className="flex items-center gap-2 mb-1">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                  style={{ backgroundColor: generateColor(user) }}
                >
                  {user.slice(0, 2).toUpperCase()}
                </div>
                <span>{user}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <button
            className="bg-gray-700 py-1 rounded hover:bg-gray-600"
            onClick={() => copyToClipboard(roomId)}
          >
            Copy Room ID
          </button>
          <button
            className="bg-red-700 py-1 rounded hover:bg-red-600"
            onClick={handleLeave}
          >
            Leave
          </button>
        </div>
      </div>

      <div className="flex-1">
        <AceEditor
          placeholder="Write your code here..."
          className="roomCodeEditor"
          mode={language}
          keyboardHandler={codeKeybinding}
          theme="monokai"
          name="collabEditor"
          width="100%"
          height="100vh"
          value={fetchedCode}
          onChange={onChange}

          onLoad={onEditorLoad}
          fontSize={15}
          setOptions={{
            enableLiveAutocompletion: true,
            highlightActiveLine: true,
            showGutter: true,
            useWorker: false, // 🚫 disable background syntax workers
          }}

          // showPrintMargin
          // showGutter
          // highlightActiveLine
          // enableLiveAutocompletion
          // enableBasicAutocompletion={false}
          // enableSnippets={false}
          // wrapEnabled
          // tabSize={2}
          // editorProps={{ $blockScrolling: true }}
        />
      </div>
      <Toaster />

      {/* Cursor CSS
      <style jsx global>{`
        .remote-cursor {
          position: absolute;
          border-left: 2px solid;
          animation: blink 1s step-start infinite;
        }
        @keyframes blink {
          50% {
            border-color: transparent;
          }
        }
        .remote-label {
          user-select: none;
          pointer-events: none;
          white-space: nowrap;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
        }
      `}</style> */}

    </div>
  );
}
