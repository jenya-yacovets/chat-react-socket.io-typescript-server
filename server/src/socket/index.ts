import SocketIo from 'socket.io'

export default (io: SocketIo.Server) => {
    io.on('connection', (socket: SocketIo.Socket) => {
        console.log('Connection to socket id: %s', socket.id)

        socket.on('message', (data) => {
            console.log('Get message from client: $s', socket.id)
            console.log(data)
        })
    })
}