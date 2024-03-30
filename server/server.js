const socket = require('socket.io')

const io = new socket.Server(3000, {
    cors: { 
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

io.on('connection', (socket) => {    
    socket.on('send-message', (message, username, room) => {
        socket.to(room).emit('broadcast-message', message, username);
    })
    socket.on('send-user-connected', (username, room) => {
        console.log(`${username} connected and is in room ${room}`)
        socket.join(room)
        socket.broadcast.emit('broadcast-user-connected', username)
    })
    socket.on('join-room', (room) => {
        socket.join(room)
        console.log('Joined the room: ', room)
    })
    socket.on('leave-room', (room) => {
        socket.leave(room)
        console.log('Left the room: ', room)
    })
})


