"use client";

import { useSearchParams } from "next/navigation";
import SocketWrapper from "@/app/components/SocketWrapper";
import Room from "@/app/components/Room";

export default function RoomPageClient({ roomId }) {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  // console.log("🧠 Loaded RoomPageClient:", { roomId, username });


  return (
    <SocketWrapper roomId={roomId} username={username}>
      <Room roomId={roomId} username={username}/>
    </SocketWrapper>
  );
}
