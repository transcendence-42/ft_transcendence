import './chat.css';
import '../../Components/Tools/Box.css';
import { useState, useEffect } from 'react';
import { socket } from '../../Socket';
import { Message, Channel, Payload } from './entities';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
  };
  const handleSubmit = (e: any) => {
    const date = Date.now();
    const messageToSend: Message = { id: '', message: message, date: date };
    const channel: Channel = { id: '', name: '' };
    const payload: Payload = { message: messageToSend, channel };
    socket.emit('sendMessage', payload);
    setMessage('');
  };

  const handleJoinChannel = (e: any, channel: string) => {
    socket.emit('joinChannel', channel);
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server successfully');
    });

    socket.on('updateMessages', (messages) => {
      if (messages.length !== 0) {
        setAllMessages(messages);
        window.sessionStorage.setItem('allMessages', JSON.stringify(messages));
      }
    });
    socket.on('updateUsers', (allUsers) => {
      setAllUsers(allUsers);
    });
    socket.on('userJoined', (payload: Payload) => {
      console.log(`Client has joinied channel! ${JSON.stringify(payload.message, null, 4)}`);
    });
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
            Channels
            <button
              style={{ fontSize: '5px', width: '40px', height: '15px' }}
              onClick={(e) => handleJoinChannel(e, '42AI')}>
              42Ai
            </button>
            <button
              style={{ fontSize: '5px', width: '40px', height: '15px' }}
              onClick={(e) => handleJoinChannel(e, '42Electronics')}>
              42Electronics
            </button>
            <button
              style={{ fontSize: '5px', width: '40px', height: '15px' }}
              onClick={(e) => handleJoinChannel(e, '42Entrepreneurs')}>
              42Entrepreneurs
            </button>
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
            {JSON.parse(window.sessionStorage.getItem('allMessages') || '[]').length !== 0 ? (
              <>
                {JSON.parse(window.sessionStorage.getItem('allMessages') || '[]').map(
                  (message: Message) => (
                    <li key={message.id}>{message.message}</li>
                  )
                )}
              </>
            ) : (
              <>
                <li>{'Des messages'}</li>
                <li>{'Des messages'}</li>
                <li>{'Des messages'}</li>
                <li>{'Des messages'}</li>
                <li>{'Des messages'}</li>
                <li>{'Des messages'}</li>
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
