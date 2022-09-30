import Modal from 'react-bootstrap/Modal';
import Context from "../../../Context/Context";
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import {postFetchAuthentification} from "../Fetch/postFetchAuthentification"
import FailAndSuccessAuthenticate from './FailAndSuccessAuthenticate'
import React, {useEffect, useState, useContext} from "react";

const ModalAuthentification =
({ title, closeHandler, show, textBtn1,
  handleBtn1, textBtn2, handleBtn2, up } : any)=> {

  /**
   * @props title:        Title of the modal
   *        closeHandler: Function used to close the modal
   *        show:         Boolean to display the modal or not
   *        textBtn1:     Text of the first button (left one)
   *        handleBtn1:   Function associated with the first button
   *        textBtn2:     Text of the second button (right one)
   *        handleBtn2:   Function associated with the second button
   */

   const contextValue = useContext(Context);
   const [content, setcontent] = useState('');
   const [status, setStatus] = useState(2);

   function handleChange(event : any) {
     setcontent(event.target.value);
   };

   function patchAndClose(e : any)
   {
     e.preventDefault();
     const status = postFetchAuthentification({keyGen: content});
     status.then((responseObject)=> {
       if (responseObject.status !== 200)
       {
        setStatus(0);
        return;
       }
       setStatus(1);
       localStorage.setItem("pathIsFree", JSON.stringify(true));
       contextValue.updateIsConnected(true);
       setTimeout(() => {
       up();
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
        Enter your Google Authenticator code
        <br/>
        <form onSubmit={patchAndClose}>
						<input
              maxLength={6}
							type="text"
							value={content}
							onChange={handleChange}
							className="inputContent"/>
        </form>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
      {<FailAndSuccessAuthenticate status={status}/>}
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

export default ModalAuthentification;
