// // server.js
// import { createServer } from "http";
// import { Server } from "socket.io";

// const httpServer = createServer();
// const io = new Server(httpServer, {
//     cors: { origin: "*", methods: ["GET", "POST"] },
//     path: "/socket.io",
// });

// const socketID_to_Users_Map = {};
// const roomID_to_Code_Map = {};

// async function getUsersInRoom(roomId) {
//     const sockets = await io.in(roomId).allSockets();
//     return Array.from(sockets).map((id) => socketID_to_Users_Map[id]?.username);
// }

// async function updateUsers(io, socket, roomId) {
//     const username = socketID_to_Users_Map[socket.id]?.username;
//     socket.in(roomId).emit("member left", { username });
//     delete socketID_to_Users_Map[socket.id];
//     const users = await getUsersInRoom(roomId);
//     io.to(roomId).emit("updating client list", { userslist: users });
//     if (!users.length) delete roomID_to_Code_Map[roomId];
// }

// io.on("connection", (socket) => {
//     console.log("🔥 Connected:", socket.id);

//     socket.on("when a user joins", async ({ roomId, username }) => {
//         socketID_to_Users_Map[socket.id] = { username };
//         socket.join(roomId);

//         // gather latest room data
//         const users = await getUsersInRoom(roomId);
//         const data = roomID_to_Code_Map[roomId] || { code: "", languageUsed: "javascript" };

//         // 1️⃣ send full state to this new user
//         io.to(socket.id).emit("initial sync", {
//             userslist: users,
//             code: data.code,
//             languageUsed: data.languageUsed,
//         });

//         // 2️⃣ update everyone else's lists
//         io.to(roomId).emit("updating client list", { userslist: users });

//         // 3️⃣ let others know someone joined
//         socket.in(roomId).emit("new member joined", { username });
//     });




//     socket.on("update language", ({ roomId, languageUsed }) => {
//         roomID_to_Code_Map[roomId] = { ...(roomID_to_Code_Map[roomId] || {}), languageUsed };
//         socket.in(roomId).emit("on language change", { languageUsed });
//     });

//     socket.on("update code", ({ roomId, code }) => {
//         roomID_to_Code_Map[roomId] = { ...(roomID_to_Code_Map[roomId] || {}), code };
//         socket.in(roomId).emit("on code change", { code });
//     });

//     socket.on("disconnecting", () => {
//         socket.rooms.forEach((roomId) => updateUsers(io, socket, roomId));
//     });

// });


// httpServer.listen(5000, () => console.log("✅ Socket.IO running on :5000"));

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

async function updateUserslistAndCodeMap(io, socket, roomId) {
    const username = socketID_to_Users_Map[socket.id]?.username;
    if (username) socket.in(roomId).emit("member left", { username });

    delete socketID_to_Users_Map[socket.id];
    const userslist = await getUsersinRoom(roomId);
    socket.in(roomId).emit("updating client list", { userslist });
    if (userslist.length === 0) delete roomID_to_Code_Map[roomId];
}

io.on("connection", (socket) => {
    console.log("🔥 Connected:", socket.id);

    // socket.on("when a user joins", async ({ roomId, username }) => {
    //     console.log("👤", username, "joined room:", roomId);
    //     socketID_to_Users_Map[socket.id] = { username };
    //     socket.join(roomId);

    //     const userslist = await getUsersinRoom(roomId);

    //     // Update users list for everyone
    //     socket.in(roomId).emit("updating client list", { userslist });
    //     io.to(socket.id).emit("updating client list", { userslist });

    //     // Send existing code/language to new user
    //     if (roomID_to_Code_Map[roomId]) {
    //         const { code, languageUsed } = roomID_to_Code_Map[roomId];
    //         io.to(socket.id).emit("on code change", { code });
    //         io.to(socket.id).emit("on language change", { languageUsed });
    //     }

    //     socket.in(roomId).emit("new member joined", { username });
    // });

    // socket.on("when a user joins", async ({ roomId, username }) => {

    //     io.to(socket.id).emit("refresh hint");


    //     console.log(`👤 ${username} joined room ${roomId}`);
    //     socketID_to_Users_Map[socket.id] = { username };
    //     socket.join(roomId);

    //     const userslist = await getUsersinRoom(roomId);
    //     io.to(roomId).emit("updating client list", { userslist });

    //     const roomData = roomID_to_Code_Map[roomId] || { code: "", languageUsed: "javascript" };
    //     io.to(socket.id).emit("on code change", { code: roomData.code });
    //     io.to(socket.id).emit("on language change", { languageUsed: roomData.languageUsed });




    //     socket.in(roomId).emit("new member joined", { username });

    //     // ✅ Send the refresh hint to the user who *just joined*

    // });

    socket.on("when a user joins", async ({ roomId, username }) => {
        console.log(`👤 ${username} joined room ${roomId}`);

        // 1️⃣ Store the username
        socketID_to_Users_Map[socket.id] = { username };

        // 2️⃣ Join the room
        if (socket.rooms.has(roomId)) return;

        socket.join(roomId);

        socket.emit("refresh hint");


        // 3️⃣ Get the current list of users
        const userslist = await getUsersinRoom(roomId);

        // 4️⃣ Send updated list to everyone in the room (including the new user)
        io.to(roomId).emit("updating client list", { userslist });

        // 5️⃣ Send the current code + language to the new user only
        const roomData = roomID_to_Code_Map[roomId] || { code: "", languageUsed: "javascript" };
        io.to(socket.id).emit("on code change", { code: roomData.code });
        io.to(socket.id).emit("on language change", { languageUsed: roomData.languageUsed });

        // 6️⃣ Notify others that someone joined
        socket.in(roomId).emit("new member joined", { username });

        // 7️⃣ Finally, send refresh hint to the user who joined
        io.to(socket.id).emit("refresh hint");
    });


    // socket.on("when a user joins", async ({ roomId, username }) => {
    //     console.log(`👤 ${username} joined room ${roomId}`);

    //     // 1️⃣ Store and join
    //     socketID_to_Users_Map[socket.id] = { username };
    //     socket.join(roomId);

    //     // 2️⃣ Update everyone’s list
    //     const userslist = await getUsersinRoom(roomId);
    //     io.to(roomId).emit("updating client list", { userslist });

    //     // 3️⃣ Send code + language to new joiner
    //     const roomData = roomID_to_Code_Map[roomId] || { code: "", languageUsed: "javascript" };
    //     io.to(socket.id).emit("on code change", { code: roomData.code });
    //     io.to(socket.id).emit("on language change", { languageUsed: roomData.languageUsed });

    //     // 4️⃣ Notify others (but not the new one)
    //     socket.in(roomId).emit("new member joined", { username });

    //     // 5️⃣ Send “refresh hint” only to the new joiner
    //     io.to(socket.id).emit("refresh hint");
    // });



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


    socket.on("leave room", async ({ roomId }) => {
        const username = socketID_to_Users_Map[socket.id]?.username;
        if (username) {
            delete socketID_to_Users_Map[socket.id];
        }
        socket.leave(roomId);

        const userslist = await getUsersinRoom(roomId);
        io.to(roomId).emit("updating client list", { userslist });
        socket.in(roomId).emit("member left", { username });
        console.log(`❌ ${username} left room ${roomId}`);
    });

    // socket.on("disconnecting", () => {
    //     socket.rooms.forEach((roomId) => {
    //         if (roomID_to_Code_Map[roomId]) {
    //             updateUserslistAndCodeMap(io, socket, roomId);
    //         }
    //     });
    // });

    // socket.on("disconnect", () => {
    //     console.log("❌ Disconnected:", socket.id);
    // });

    socket.on("disconnecting", async () => {
        const joinedRooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
        const username = socketID_to_Users_Map[socket.id]?.username;
        if (!username) return;

        for (const roomId of joinedRooms) {
            delete socketID_to_Users_Map[socket.id];
            const userslist = await getUsersinRoom(roomId);
            io.to(roomId).emit("updating client list", { userslist });
            socket.in(roomId).emit("member left", { username });
            console.log(`❌ ${username} disconnected from room ${roomId}`);
        }
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
    });


});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
    console.log(`✅ Socket.IO server running on http://localhost:${PORT}`)
);
