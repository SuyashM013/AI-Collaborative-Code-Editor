// // "use client";
// import Room from "@/app/components/Room";
// import SocketWrapper from "@/app/components/SocketWrapper";

// export default function RoomPage({ params }) {
//     const { roomId } = params; // same as useParams() in React Router
//     return (
//         <SocketWrapper>
//             <Room roomId={roomId} />
//         </SocketWrapper>
//     );
// }


// "use client";
// import { use } from "react";
// import Room from "@/app/components/Room";
// import SocketWrapper from "@/app/components/SocketWrapper";

// export default function RoomPage({ params }) {
//   const { roomId } = use(params); // ✅ unwraps the async params promise
//   return (
//     <SocketWrapper roomId={roomId}>
//       <Room roomId={roomId} />
//     </SocketWrapper>
//   );
// }


// app/room/[roomId]/page.js
import RoomPageClient from "./RoomPageClient";

export default async function Page({ params }) {
  const resolvedParams = await params; // ✅ unwraps the ReactPromise
  const { roomId } = resolvedParams;

  console.log("✅ roomId (resolved):", roomId);

  return <RoomPageClient roomId={roomId} />;
}



// import RoomPageClient from "./RoomPageClient";

// // ✅ This runs on the server, so `params` works perfectly
// export default function RoomPage({ params }) {
//   const { roomId } = params;
//   return <RoomPageClient roomId={roomId} />;
// }
