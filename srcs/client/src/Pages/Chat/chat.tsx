import './chat.css';
import '../../Components/Tools/Box.css';
import { useState, useEffect } from 'react';
import { socket } from '../../Socket';
import { Message } from './entities';

console.log = function () {};

export default function Chat() {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);

  const handleMessageChange = (e: any) => {
    console.log(`This is state before us ${message}`);
    setMessage(e.target.value);
    console.log(`This is state after us ${message}`);
  };
  const handleSubmit = () => {
    const date = Date.now();
    const messageToSend: Message = { id: '', message: message, date: date };
    socket.emit('sendMessage', messageToSend);
    setMessage('');
  };

  const eventSendMessage = () => {
    socket.on('updateMessages', (messages) => {
      console.log('recieved updateMessage with message:', messages);
      setAllMessages(messages);
    });
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server successfully');
    });
    const message: Message = { id: '', message: 'hello', date: 3242 };
    socket.emit('message', message);
    socket.on('updateUsers', (allUsers) => {
      console.log('This is the list of all users: ');
      allUsers.map((user: any) => console.log(JSON.stringify(user, null, 4)));
    });
    eventSendMessage();
  }, []);
  return (
    <div className="chat">
      <div
        className="blueBoxChat"
        style={{
          width: '20%',
          height: '80vh'
        }}>
        <div
          className="yellowPinkBoxChat"
          style={{
            width: '70%',
            height: '7%'
          }}>
          <div className="yellowTextChat" style={{ fontSize: '2vw' }}>
            {' '}
            Channels{' '}
          </div>
        </div>
        <div className="friends">
          <div>
            <p className="name" style={{ fontSize: '1vw' }}>
              Fred
            </p>
            <p className="name" style={{ fontSize: '1vw' }}>
              Bob
            </p>
            <p className="name" style={{ fontSize: '1vw' }}>
              Charly
            </p>
          </div>
        </div>
      </div>
      <div
        className="blueBoxChat"
        style={{
          width: '80%',
          height: '80vh'
        }}>
        <div style={{ color: 'white', fontSize: '10px' }} className="conversation">
          <ul className="messages">
            {allMessages.length !== 0 ? (
              <>
                {allMessages.map((message: Message) => (
                  <div key={message.id}>{message.message}</div>
                ))}
              </>
            ) : (
              <>
                <div>{'Des messages'}</div>
                <div>{'Des messages'}</div>
                <div>{'Des messages'}</div>
                <div>{'Des messages'}</div>
                <div>{'Des messages'}</div>
                <div>{'Des messages'}</div>
              </>
            )}
          </ul>
        </div>
        <div className="chatInput">
          <input
            style={{ color: 'black' }}
            placeholder="send a message.."
            onChange={handleMessageChange}
            value={message}></input>
          <button
            style={{ fontSize: '10px', width: '40px', height: '15px' }}
            onClick={handleSubmit}>
            Send!
          </button>
        </div>
      </div>
    </div>
  );
}
