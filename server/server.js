const socket = require('socket.io')

const io = new socket.Server(3000, {
    cors: { 
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

io.on('connection', (socket) => {    
    socket.on('send-message', (message, username) => {
        socket.broadcast.emit('broadcast-message', message, username)
        console.log('message broadcasted by user: ', socket.id)
    })

    socket.on('send-user-connected', (username) => {
        socket.broadcast.emit('broadcast-user-connected', username)
    })
})


