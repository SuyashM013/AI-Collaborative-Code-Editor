
// "use client";

// import React, { useEffect, useMemo } from "react";
// import { toast } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import { io } from "socket.io-client";

// function addPropsToReactElement(element, props) {
//   if (React.isValidElement(element)) {
//     return React.cloneElement(element, props);
//   }
//   return element;
// }

// function addPropsToChildren(children, props) {
//   if (!Array.isArray(children)) {
//     return addPropsToReactElement(children, props);
//   }
//   return children.map((child) => addPropsToReactElement(child, props));
// }

// export default function SocketWrapper({ children, roomId, username }) {
//   const router = useRouter();

//   // ✅ Create socket connection once
//   const socket = useMemo(() => {
//     const backendURL =
//       process.env.NEXT_PUBLIC_WEB_SOCKET_URL || "http://localhost:5000";
//     return io(backendURL, { transports: ["websocket"] });
//   }, []);

//   useEffect(() => {
//     if (!roomId || !username) {
//       toast.error("Missing username or room ID");
//       router.push("/");
//       return;
//     }

//     // Emit join event right away (like original version)
//     socket.emit("when a user joins", { roomId, username });

//     return () => {
//       socket.disconnect();
//     };
//   }, [socket, roomId, username, router]);

//   // ✅ Fallback UI
//   if (!roomId || !username) {
//     return (
//       <div className="flex h-screen items-center justify-center bg-black text-white">
//         <h2>No username or room ID provided. Please join again.</h2>
//       </div>
//     );
//   }

//   return <>{addPropsToChildren(children, { socket })}</>;
// }


// try this 

"use client";
import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";

function addPropsToReactElement(element, props) {
  if (React.isValidElement(element)) return React.cloneElement(element, props);
  return element;
}

function addPropsToChildren(children, props) {
  if (!Array.isArray(children)) return addPropsToReactElement(children, props);
  return children.map((child) => addPropsToReactElement(child, props));
}

export default function SocketWrapper({ children, roomId, username }) {
  const router = useRouter();

  const socket = useMemo(() => {
    const backendURL =
      process.env.NEXT_PUBLIC_WEB_SOCKET_URL || "http://localhost:5000";
    return io(backendURL, { transports: ["websocket"] });
  }, []);

  useEffect(() => {
    if (!roomId || !username) {
      toast.error("Missing username or room ID");
      router.push("/");
    }

    return () => socket.disconnect();
  }, [socket, roomId, username, router]);

  if (!roomId || !username) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <h2>No username or room ID provided.</h2>
      </div>
    );
  }

  return <>{addPropsToChildren(children, { socket, roomId, username })}</>;
}
