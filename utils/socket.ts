import { io, Socket } from "socket.io-client"

let socket: Socket | null = null;

export const initSocket = (token: string) => {
    socket = io(process.env.SOCKETURL, {
        transports: ['websocket'],
        auth: { token }
    })
};

export const getSocket = () : Socket | null => socket;