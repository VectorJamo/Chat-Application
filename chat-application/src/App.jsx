import {useState, useEffect} from 'react'
import io from 'socket.io-client'
import './App.css'

const socket = io('http://localhost:3000')

export default function App() {
  const [header, setHeader] = useState('')

  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')

  const [messages, setMessages] = useState([])

  useEffect(() => {
    
    // Connect to the server
    socket.on('connect', () => {
      console.log('Connected to the server')
      console.log(socket.id)

      setHeader('You connected')
    })

    socket.on('broadcast-message', (message, id) => {
      if (id != socket.id){
        console.log('Receiving id: ', id)
        console.log('User id: ', socket.id)

        //DO NOT DO THIS: Since both .on() and setState functions are async in nature, the temp variable will not exist when setMessages takes effect
        //const temp = messages.slice()
        //temp.push('Another User: ' + message)
        //setMessages(temp)

        // Instead, do this.
        setMessages((prevMessages) => [...prevMessages, 'Another User: ' + message]);
      }else{
        console.log('I AM EQUAL')
      }
    })

  }, [])


  function handleMessageSend(){
    socket.emit('send-message', message)
    
    const temp = messages.slice()
    temp.push('You: ' + message)
    setMessages(temp)

    console.log(temp)
  }


  return (
    <div className="main-body">
      <div className='chat-area'>
        <div className='chats'>
          <h3>{header}</h3>

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
            <button className='send-room-name'>Enter Room</button>
          </div>
        </div>
      </div>
    </div>
  )
}