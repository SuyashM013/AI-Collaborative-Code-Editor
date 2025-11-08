'use client';

import { useState } from "react"

import { v4 as uuidv4, validate } from 'uuid';
import { Toaster, toast } from 'react-hot-toast';

import DarkVeil from '@/components/DarkVeil';
import Header from "./Header";

import { useRouter } from "next/navigation";

export default function JoinRoom() {

    const router = useRouter();

    const [roomId, setRoomId] = useState("")
    const [username, setUsername] = useState("")

    // function handleRoomSubmit(e) {
    //     e.preventDefault()
    //     if (!validate(roomId)) {
    //         toast.error("Incorrect room ID")
    //         return
    //     }
    //     username && navigate(`/room/${roomId}`, { state: { username } })
    // }

    const handleRoomSubmit = (e) => {
        e.preventDefault();

        if (!validate(roomId)) {
            toast.error("Incorrect room ID");
            return;
        }

        if (username) {
            // Navigate to /room/[roomId] with query params
            router.push(`/room/${roomId}?username=${encodeURIComponent(username)}`);
        } else {
            toast.error("Please enter your username");
        }
    };

    function createRoomId(e) {
        try {
            setRoomId(uuidv4())
            toast.success("Room created")
        } catch (exp) {
            console.error(exp)
        }
    }

    return (
        <div className=" w-screen min-h-screen ">

            <div className="h-screen w-screen absolute overflow-hidden z-1">
                <DarkVeil speed={2} warpAmount={1.5} scanlineIntensity={1} />
            </div>
            <div>
                <Header />

            </div>

            <div className="absolute h-screen z-10 w-screen  flex flex-col items-center justify-center">

                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-25 text-center drop-shadow-lg shadow-sky-200/40 secon-font">Join a Coding Room....</h1>


                </div>



                <form className="text-white flex flex-col items-center  gap-6 p-8 rounded-xl shadow-2xl drop-shadow-lg shadow-sky-200/40 bg-accent/20 backdrop-blur-sm" onSubmit={handleRoomSubmit}>
                    <p className="w-full text-font" >Paste your invitation code down below</p>

                    <div className="w-full flex flex-col gap-2">
                        <input
                            className="w-full bg-accent/30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700 text-white joinBoxInput"
                            id="roomIdInput"
                            type="text"
                            placeholder="Enter room ID"
                            required
                            onChange={(e) => { setRoomId(e.target.value) }}
                            value={roomId}
                            autoSave="off"
                            autoComplete="off"
                        />
                        <label htmlFor="roomIdInput" className="text-red-400">{roomId ? '' : "Room ID required"}</label>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                        <input
                            className="w-full bg-accent/30 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-700 text-white joinBoxInput"
                            id="usernameInput"
                            type="text"
                            placeholder="Enter Guest Username"
                            required
                            value={username}
                            onChange={e => { setUsername(e.target.value) }}
                            autoSave="off"
                            autoComplete="off"
                        />
                        <label htmlFor="usernameInput" className="text-red-400">{username ? '' : "username required"}</label>
                    </div>

                    <button className="w-1/2 bg-foreground/50 rounded-md px-4 py-2 focus:outline-none focus:ring-2  cursor-pointer hover:bg-foreground/70 " type="submit">Join</button>
                    <p>Don't have an invite code? Create your <span
                        style={{ textDecoration: "underline", cursor: "pointer", color: "#a78bfa" }}
                        onClick={createRoomId}
                    >own room</span></p>


                </form>

            </div>
            <Toaster />
        </div>
    )
}