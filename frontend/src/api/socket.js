import { io } from "socket.io-client";

let socket;
export const connectSocket = (onConnect) => {
  if (!socket) {
    // Use a dedicated socket URL if provided. Note: Vercel serverless deployments
    // do not support long-lived Socket.IO servers — socket features require a
    // separate host (Render, Railway, Fly.io, VPS) that runs `src/server.js`.
    const socketUrl = process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_API_URL || "http://localhost:5000";
    socket = io(socketUrl);
    socket.on("connect", () => onConnect && onConnect(socket.id));
  }
  return socket;
};

export const joinStaffRoom = (staffId) => {
  if (!socket) return;
  socket.emit("joinStaff", staffId);
};

export const leaveStaffRoom = (staffId) => {
  if (!socket) return;
  socket.emit("leaveStaff", staffId);
};

export const onAssignmentUpdate = (cb) => {
  if (!socket) return;
  socket.on("assignmentUpdated", cb);
};

export const onAssignmentStatus = (cb) => {
  if (!socket) return;
  socket.on("assignmentStatus", cb);
};

export const disconnectSocket = () => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};
