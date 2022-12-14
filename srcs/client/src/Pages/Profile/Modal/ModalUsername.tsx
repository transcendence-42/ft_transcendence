import Modal from 'react-bootstrap/Modal';
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import "./ModalChangeContent.css"
import {patchFetchUsername} from "../Fetch/patchFetchUsername"
import FailAndSuccessUsername from './FailAndSuccessUsername'
import React, {useContext, useEffect, useState} from "react";
import { GameSocketContext } from '../../Game/socket/socket';

const ModalUsername =({
  title,
  closeHandler,
  show,
  textBtn1,
  handleBtn1,
  textBtn2,
  handleBtn2,
  up,
  id,
  showResponse,
  setShowResponse,
} : any)=> {

  /**
   * @props title:        Title of the modal
   *        closeHandler: Function used to close the modal
   *        show:         Boolean to display the modal or not
   *        textBtn1:     Text of the first button (left one)
   *        handleBtn1:   Function associated with the first button
   *        textBtn2:     Text of the second button (right one)
   *        handleBtn2:   Function associated with the second button
   */

  const [content, setcontent] = useState('');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState(2);
  const socket = useContext(GameSocketContext);

   function handleChange(event : any) {
     setcontent(event.target.value);
     const apiUrl: string = process.env.REACT_APP_API_URL as string;
     setUrl(`${apiUrl}/users/` + id);
   };

   function patchAndClose(e : any)
   {
     e.preventDefault();
     const status = patchFetchUsername({url: url, name: content});
     status.then((response) =>{
      	return (response.json())
      }).then((response) =>{
        if (response.message)
        {
          setStatus(0);
          setShowResponse(1);
          return;
        }
        socket.emit('updatePlayer', { name: content });
      	setStatus(1);
        setShowResponse(1);
        up();
        setTimeout(() => {
          closeHandler();
        }, 500);
      })
   }

   useEffect(() => {
    setStatus(2);
   },[])

  return (
    <Modal show={show} onHide={closeHandler} >
      <Modal.Header closeButton>
        <Modal.Title className="text-blue">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-pink text-center ">
        <form onSubmit={patchAndClose}>
						<input
              maxLength={12}
							type="text"
							value={content}
							onChange={handleChange}
              placeholder="New Username"
							className="rounded-3 input-field-chat w-75 "/>
        </form>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
      {showResponse !== 1 ? '' : <FailAndSuccessUsername status={status} />}
        {handleBtn1 &&
          <button
            type="button"
            className="btn btn-blue text-blue"
            onClick={handleBtn1}>{textBtn1}
          </button>
        }
        {handleBtn2 &&
          <button
            className="btn btn-pink text-pink"
            onClick={patchAndClose}>{textBtn2}
          </button>
        }
      </Modal.Footer>
    </Modal>
  )
}

export default ModalUsername;
