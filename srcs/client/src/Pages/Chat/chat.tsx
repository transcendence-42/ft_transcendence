import './chat.css';
import '../../Components/Tools/Box.css';
import { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { Message, Channel } from './entities';

export default function Chat({ socket, ...props }: { socket: Socket }) {
  const [message, setMessage] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [currentChannel, setCurrentChannel] = useState('lobby');

  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
  };
  const handleSubmit = (e: any) => {
    if (message === '') return;
    const date = Date.now();
    const channel: Channel = { id: '', name: currentChannel };
    const messageToSend: Message = { id: '', content: message, date, channel };
    socket.emit('sendMessage', messageToSend);
    setMessage('');
  };

  const handleJoinChannel = (e: any, channel: string) => {
    socket.emit('joinChannel', channel);
    setCurrentChannel(channel);
  };

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server successfully');

      const userId = document.cookie;
      console.log(`This is user id on connect ${userId}`);
      if (userId === null || userId === '') {
        socket.emit('setId');
        socket.on('setId', (id) => {
          document.cookie = id;
          console.log(`Setting id from server ${id}`);
          socket.emit('addUser', id);
        });
      }
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
    socket.on('userJoined', (payload: Message) => {
      console.log(`Client has joinied channel! ${JSON.stringify(payload.channel, null, 4)}`);
    });
    console.log(`This is the list of all users`);
    allUsers.map((user) => console.log(`This is user ${JSON.stringify(user, null, 4)}`));
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
      </div>
      <div
        className="blueBoxChat"
        style={{
          width: '80%',
          height: '80vh'
        }}>
        <div className="channel">
          -------Channel: {currentChannel}-------
          <br />
          <br />
        </div>
        <div className="conversation">
          <ul className="messages">
            {/* {JSON.parse(window.sessionStorage.getItem('allMessages') || '[]').length !== 0  */}
            {allMessages.length > 0 ? (
              <>
                {/* {JSON.parse(window.sessionStorage.getItem('allMessages') || '[]').map( */}
                {allMessages.map((message: Message) =>
                  message.channel.name === currentChannel ? (
                    <li key={message.id}>{message.content}</li>
                  ) : (
                    ''
                  )
                )}
              </>
            ) : (
              <>
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
            className="chatInputField"
            placeholder="send a message.."
            onChange={handleMessageChange}
            value={message}></input>
          <button className="btn btn-light" onClick={handleSubmit}>
            Send!
          </button>
        </div>
      </div>
    </div>
  );
}
