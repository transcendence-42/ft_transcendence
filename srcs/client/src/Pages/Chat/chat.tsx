import './chat.css';
import '../../Components/Tools/Box.css';
// import { useState, useEffect } from 'react';
// import { Socket } from 'socket.io-client';
import { Message, Channel } from './entities';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import PongAdvancedModal from '../../Components/Modal/PongAdvancedModal';
import ChannelList from './ChannelList';

const Chat = () => {

    // state
    const [showChannelMenu, setShowChannelMenu] = useState(false);

    // handlers
    const handleCloseChannelMenu = () => setShowChannelMenu(false);
    const handleShowChannelMenu = () => setShowChannelMenu(true);

    return (
        <div className='container'>
            <PongAdvancedModal
                title="Channel list"
                show={showChannelMenu}
                closeHandler={handleCloseChannelMenu}
                textBtn1="Cancel"
                handleBtn1={handleCloseChannelMenu}
                textBtn2="Validate"
                handleBtn2={handleCloseChannelMenu}
            ><ChannelList /></PongAdvancedModal>
            <div className='row row-color'>
                <div className='col-2 rounded-4 vh-100 blue-box-chat'>
                    <div className='row'>
                        <div className='col'>
                            <br></br>
                            <p className='yellow-titles'>Channels</p>
                        </div>
                        <div className='col'>
                            <br></br>
                            <button className='float-end rounded-4 dropdown-toggle color-dropdown' data-bs-toggle="dropdown" aria-expanded="false"></button>
                            <ul className="dropdown-menu channel-menu">
                                <li className='dropdown-item' onClick={handleShowChannelMenu}>Browse channels</li>
                                <li className='dropdown-item' onClick={handleShowChannelMenu}>create channels</li>
                            </ul>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col overflow-auto scroll-bar'>
                            <p>Channel name</p>
                            <p>Channel name</p>
                            <p>Channel name</p>
                            <p>Channel name</p>
                            <p>Channel name</p>
                            <p>Channel name</p>
                            <p>Channel name</p>
                        </div>
                    </div>
                    <br></br>
                    <br></br>
                    <div className='row'>
                        <div className='col'>
                            <p className='yellow-titles'>Messages</p>
                        </div>
                        <div className='col'>
                            <button className='plus float-end rounded-4' onClick={handleShowChannelMenu}>+</button>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col overflow-auto scroll-bar'>
                            <p>Message</p>
                            <p>Message</p>
                            <p>Message</p>
                            <p>Message</p>
                            <p>Message</p>
                            <p>Message</p>
                            <p>Scroll</p>
                        </div>
                    </div>
                </div>
                <div className='col-8 rounded-4 blue-box-chat'>
                    <div className='row'>
                        <div className='col'>
                            <br></br>
                            <p className='blue-titles'>Channel Name</p>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col input-position'>
                            <input type='text' className='rounded-3 input-field-chat yellow-box-chat' placeholder="Send a message..."></input>
                        </div>
                    </div>
                </div>
                <div className='col-2 rounded-4 blue-box-chat'>
                    <div className='row'>
                        <div className='col'>
                            <br></br>
                            <p className='blue-titles center-position'>Members</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;
