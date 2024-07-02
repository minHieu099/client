import { getUsername } from "src/routes/auth";

export function initializeWebSocket(onMessage, onClose) {
  const socket = new WebSocket("ws://192.168.3.101:19999/ws");

  socket.addEventListener("open", (event) => {
      // Gửi dữ liệu đến máy chủ
      let payload = {
          username: getUsername(),
      };
      console.log(JSON.stringify(payload));
    
      socket.send(JSON.stringify(payload));
  });

  socket.addEventListener("message", (event) => {
      let payload = JSON.parse(event.data);
      onMessage(payload);
  });

  socket.addEventListener("close", (event) => {
      onClose();
  });

  socket.addEventListener("error", (error) => {
      console.log("Không thể kết nối đến WebSocket Server");
  });

  // Đóng kết nối khi không cần thiết nữa
  return () => {
      socket.close();
  };
}