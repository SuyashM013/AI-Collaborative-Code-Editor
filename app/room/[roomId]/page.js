"use client";
import Room from "@/app/components/Room";
import SocketWrapper from "@/app/components/SocketWrapper";

export default function RoomPage({ params }) {
    const { roomId } = params; // same as useParams() in React Router
    return (
        <SocketWrapper>
            <Room roomId={roomId} />
        </SocketWrapper>
    );
}
