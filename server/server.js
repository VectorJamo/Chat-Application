const socket = require('socket.io')

const io = new socket.Server(3000, {
    cors: { 
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

io.on('connection', (socket) => {
    console.log('Connected User: ', socket.id);
    
    socket.on('send-message', (message) => {
        socket.broadcast.emit('broadcast-message', message, socket.id)
        console.log('message broadcasted by user: ', socket.id)
    })
})


