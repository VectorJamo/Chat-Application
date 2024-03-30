import {useState, useEffect} from 'react'
import io from 'socket.io-client'
import './App.css'

const socket = io('http://localhost:3000')

export default function App() {
  const [userName, setUserName] = useState('')

  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [currentRoom, setCurrentRoom] = useState('')

  const [messages, setMessages] = useState([])

  useEffect(() => {
    
    // Connect to the server
    socket.on('connect', () => {
      console.log('Connected to the server')
      console.log(socket.id)

      const person = prompt('Enter your name: ')
      const privateRoom = prompt('Enter a room to join: ')

      setUserName(person)
      setRoom('')
      setCurrentRoom(privateRoom)
      socket.emit('send-user-connected', person, privateRoom)
    })

    socket.on('broadcast-message', (message, user) => {
        //DO NOT DO THIS: Since both .on() and setState functions are async in nature, the temp variable will not exist when setMessages takes effect
        //const temp = messages.slice()
        //temp.push('Another User: ' + message)
        //setMessages(temp)

        // Instead, do this.
        setMessages((prevMessages) => [...prevMessages, user + ': ' + message]);
    })

    socket.on('broadcast-user-connected', (username) => {
      setMessages((prevMessages) => [...prevMessages, username + ' connected.']);
    })

  }, [])


  function handleMessageSend(){
    socket.emit('send-message', message, userName, room)
    
    const temp = messages.slice()
    temp.push('You: ' + message)
    setMessages(temp)

    console.log(temp)
  }

  function handleJoinRoom(){
    socket.emit('join-room', room)

    const temp = messages.slice()
    temp.push('Joined Room: ' + room)
    setMessages(temp)
    setCurrentRoom(room)
    setRoom('')
  }

  function handleClearMessages() {
    setMessages([])
  }

  function handleLeaveRoom() {
    socket.emit('leave-room', room)
    setRoom('')
    setCurrentRoom('')
    setMessages([])
  }

  return (
    <div className='chat-area'>
      <div className='room-name'>{currentRoom != '' ? 'Current Room: ' + currentRoom : ''}</div>
      <div className='chats'>
        <p>{userName != '' ? userName + ' connected.' : ''} </p>

        {
          messages.map(m => {
            return (
              <p>{m}</p>
            )
          })
        }

      </div>
      <div className="messaging">
        <div className="enter-message">
          <input type="text" value={message} id="message" name="message" onChange={(e) => {setMessage(e.target.value)}}/>
          <button className='send-message' onClick={() => {handleMessageSend(); setMessage('')}}>Send</button>
        </div>
        <div className="enter-room">
          <input type="text" value={room} id="room" name="room" onChange={(e) => {setRoom(e.target.value)}}/>
          <button className='send-room-name' onClick={() => {handleJoinRoom()}}>Enter Room</button>
        </div>
        <div className="options">
          <div>
            <button className="clear-messages" onClick={() => {handleClearMessages()}}>Clear messages</button>
            <button className="leave-room" onClick={() => {handleLeaveRoom()}}>Leave room</button>
          </div>
        </div>
      </div>
    </div>
  )
}