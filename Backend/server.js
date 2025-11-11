
// server.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.get("/", (req, res) => {
    res.send("✅ CodeColab Socket.IO Server Running!");
});

const socketID_to_Users_Map = {};
const roomID_to_Code_Map = {};

async function getUsersinRoom(roomId) {
    const sockets = await io.in(roomId).allSockets();
    const userslist = [];
    sockets.forEach((id) => {
        if (socketID_to_Users_Map[id]) {
            userslist.push(socketID_to_Users_Map[id].username);
        }
    });
    return userslist;
}


io.on("connection", (socket) => {
    // console.log("🔥 Connected:", socket.id);

    socket.on("when a user joins", async ({ roomId, username }) => {
        // console.log(`👤 ${username} joined room ${roomId}`);

        // 1️ Store the username
        socketID_to_Users_Map[socket.id] = { username };

        // 2️ Join the room
        if (socket.rooms.has(roomId)) return;

        socket.join(roomId);

        socket.emit("refresh hint");


        // 3️ Get the current list of users
        const userslist = await getUsersinRoom(roomId);

        // 4️ Send updated list to everyone in the room (including the new user)
        io.to(roomId).emit("updating client list", { userslist });

        // 5️ Send the current code + language to the new user only
        const roomData = roomID_to_Code_Map[roomId] || { code: "", languageUsed: "javascript" };
        io.to(socket.id).emit("on code change", { code: roomData.code });
        io.to(socket.id).emit("on language change", { languageUsed: roomData.languageUsed });

        // 6️ Notify others that someone joined
        socket.in(roomId).emit("new member joined", { username });

        // 7️ Finally, send refresh hint to the user who joined
        io.to(socket.id).emit("refresh hint");
    });




    socket.on("request current state", async ({ roomId }) => {
        const userslist = await getUsersinRoom(roomId);
        const roomData =
            roomID_to_Code_Map[roomId] || { code: "", languageUsed: "javascript" };

        io.to(socket.id).emit("updating client list", { userslist });
        io.to(socket.id).emit("on code change", { code: roomData.code });
        io.to(socket.id).emit("on language change", { languageUsed: roomData.languageUsed });
    });




    socket.on("update language", ({ roomId, languageUsed }) => {
        roomID_to_Code_Map[roomId] = {
            ...(roomID_to_Code_Map[roomId] || {}),
            languageUsed,
        };
        socket.in(roomId).emit("on language change", { languageUsed });
    });

    socket.on("syncing the language", ({ roomId }) => {
        if (roomID_to_Code_Map[roomId]) {
            const { languageUsed } = roomID_to_Code_Map[roomId];
            socket.in(roomId).emit("on language change", { languageUsed });
        }
    });

    socket.on("update code", ({ roomId, code }) => {
        roomID_to_Code_Map[roomId] = {
            ...(roomID_to_Code_Map[roomId] || {}),
            code,
        };
        socket.in(roomId).emit("on code change", { code });
    });

    socket.on("syncing the code", ({ roomId }) => {
        if (roomID_to_Code_Map[roomId]) {
            const { code } = roomID_to_Code_Map[roomId];
            socket.in(roomId).emit("on code change", { code });
        }
    });

    socket.on("cursor move", ({ roomId, username, cursor }) => {
        socket.in(roomId).emit("cursor update", { username, cursor });
    });



    socket.on("leave room", async ({ roomId }) => {
        const username = socketID_to_Users_Map[socket.id]?.username;
        if (username) {
            delete socketID_to_Users_Map[socket.id];
        }
        socket.leave(roomId);

        const userslist = await getUsersinRoom(roomId);
        io.to(roomId).emit("updating client list", { userslist });
        socket.in(roomId).emit("member left", { username });
        // console.log(`❌ ${username} left room ${roomId}`);
    });


    socket.on("disconnecting", async () => {
        const joinedRooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
        const username = socketID_to_Users_Map[socket.id]?.username;
        if (!username) return;

        for (const roomId of joinedRooms) {
            delete socketID_to_Users_Map[socket.id];
            const userslist = await getUsersinRoom(roomId);
            io.to(roomId).emit("updating client list", { userslist });
            socket.in(roomId).emit("member left", { username });
            // console.log(`❌ ${username} disconnected from room ${roomId}`);
        }
    });

    socket.on("disconnect", () => {
        // console.log("Socket disconnected:", socket.id);
    });


});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
    console.log(`✅ Socket.IO server running on http://localhost:${PORT}`)
);
