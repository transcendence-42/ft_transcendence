import './chat.css';
import '../../Components/Tools/Box.css';
import { useState, useEffect } from 'react';
import { socket } from '../../Socket';
import { Message } from './entities';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
  };
  const handleSubmit = () => {
    const date = Date.now();
    const messageToSend: Message = { id: '', message: message, date: date };
    socket.emit('sendMessage', messageToSend);
    setMessage('');
  };

  const eventSendMessage = () => {
    socket.on('updateMessages', (messages) => {
      setAllMessages(messages);
    });
  };

  useEffect(() => {
    console.log(`Messages useEffect ${JSON.stringify(allMessages, null, 4)}`);
    if (allMessages.length !== 0)
      window.sessionStorage.setItem('allMessages', JSON.stringify(allMessages));
    console.log(
      `Messages useEffect get Session Storage ${JSON.stringify(
        JSON.parse(window.sessionStorage.getItem('allMessages') || 'Nothing here'),
        null,
        4
      )}`
    );
  }, [allMessages]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server successfully');
    });

    socket.on('updateUsers', (allUsers) => {
      setAllUsers(allUsers);
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
            {JSON.parse(window.sessionStorage.getItem('allMessages') || '').length !== 0 ? (
              <>
                {JSON.parse(window.sessionStorage.getItem('allMessages') || '').map(
                  (message: Message) => (
                    <div key={message.id}>{message.message}</div>
                  )
                )}
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
