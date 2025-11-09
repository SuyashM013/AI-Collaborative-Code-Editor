

// "use client";
// app/room/[roomId]/page.js
import RoomPageClient from "./RoomPageClient";

export default async function Page({ params }) {
  const resolvedParams = await params; // ✅ unwraps the ReactPromise
  const { roomId } = resolvedParams;
  // const { roomId } = params;

  console.log("✅ roomId (resolved):", roomId);

  return <RoomPageClient roomId={roomId} />;
}
