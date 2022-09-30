import Modal from 'react-bootstrap/Modal';
import "../../../Components/Tools/Text.css"
import "../../../Components/Tools/Box.css"
import "./ModalChangeContent.css"
import {getFetchDoubleAuth} from "../Fetch/getFetchDoubleAuth"
import {postDoubleAuthActivate} from "../Fetch/postDoubleAuthActivate"
import FailAndSuccess from './FailAndSuccess'
import React, {useEffect, useState} from "react";

const ModalDoubleAuth = (props: any) => {
  /**
   * @props title:        Title of the modal
   *        closeHandler: Function used to close the modal
   *        show:         Boolean to display the modal or not
   *        textBtn1:     Text of the first button (left one)
   *        handleBtn1:   Function associated with the first button
   *        textBtn2:     Text of the second button (right one)
   *        handleBtn2:   Function associated with the second button
   */

  const [qrCode, setQrCode]: any = useState([]);
  const [content, setcontent] = useState('');
  const [status, setStatus] = useState(2);

	function handleChange(event : any) {
		setcontent(event.target.value);
	};

  function submitKey(e : any)
  {
    e.preventDefault();
		console.log(content);
		const status = postDoubleAuthActivate({keyGen: content});
    status.then((response) =>{
      return (response.json())
    }).then((response) =>{
      console.log(response.message);
      if(response.message === "2FA activated!")
      {
        setStatus(1);
        setTimeout(() => {
          props.closeHandler();
        }, 500);
        return;
      }
      setStatus(0);
    })
  }

   useEffect(() => {
        setStatus(2);
        const qr_code_json = getFetchDoubleAuth();
        qr_code_json.then((responseObject)=> {
          if (responseObject.body)
          {
            const reader = responseObject.body.getReader();
            return new ReadableStream({
              start(controller)
              {
                return pump();
                function pump() : any {
                  return reader.read().then(({ done, value }) => {
                    // When no more data needs to be consumed, close the stream
                    if (done) {
                      controller.close();
                      return;
                    }
                    // Enqueue the next data chunk into our target stream
                    controller.enqueue(value);
                    return pump();
                  });
                }
              }
            })
          }
        })
        // Create a new response out of the stream
        .then((stream) => new Response(stream))
        // Create an object URL for the response
        .then((response) => response.blob())
        .then((blob) => URL.createObjectURL(blob))
        // Update image
        .then((url) => setQrCode(url))
        .catch((err) => console.error(err));
    },[]);


  return (
    <Modal show={props.show} onHide={props.closeHandler} size={props.size || ''}>
      <Modal.Header closeButton>
        <Modal.Title className="text-blue">{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-pink text-center ">
        Download Google Authentificator on your Phone
        <br/>
        <br/>
          <img src={qrCode} alt="IMG"></img>
        <br/>
        <br/>
          Scan the QR Code
        <br/>
          &
        <br/>
          Enter the Code
        <br/>
        <form onSubmit={submitKey}>
						<input
							maxLength={6}
							value={content}
							onChange={handleChange}
							className="inputContent"/>
        </form>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        {<FailAndSuccess status={status}/>}
        {props.handleBtn1 &&
          <button
            type="button"
            className="btn btn-blue text-blue"
            onClick={props.handleBtn1}>{props.textBtn1}
          </button>
        }
        {props.handleBtn2 &&
          <button
            className="btn btn-pink text-pink"
            onClick={submitKey}>{props.textBtn2}
          </button>
        }
      </Modal.Footer>
    </Modal>
  )
}

export default ModalDoubleAuth;
