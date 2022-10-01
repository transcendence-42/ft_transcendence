import Modal from 'react-bootstrap/Modal';
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import "./ModalChangeContent.css"
import {patchFetchPicture} from "../Fetch/patchFetchPicture"
import FailAndSuccessPicture from './FailAndSuccessPicture'
import React, {useEffect, useState} from "react";

const ModalPicture =
({ title, closeHandler, show, textBtn1,
  handleBtn1, textBtn2, handleBtn2, up, id } : any)=> {

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

   function handleChange(event : any) {
     setcontent(event.target.value);
     setUrl("http://127.0.0.1:4200/users/" + id);
   };

   function patchAndClose(e : any)
   {
     e.preventDefault();
     const status = patchFetchPicture({url: url, picture: content});
     status.then((responseObject)=> {
       if (responseObject.status === 400)
       {
        setStatus(0);
        return;
       }
       setStatus(1);
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
							type="text"
							value={content}
							onChange={handleChange}
							className="inputContent"/>
        </form>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
      {<FailAndSuccessPicture status={status}/>}
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

export default ModalPicture;
