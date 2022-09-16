import "../../Components/Tools/Box.css"
import "../../Components/Tools/Text.css"
import './Game.css'
import Modal from 'react-bootstrap/Modal';

const PongModal = (props: any) => {
  /** 
   * @props title:        Title of the modal
   *        mainText:     Main information of the modal in increased size.
   *        subText:      Additionnal information for the user
   *        closeHandler: Function used to close the modal
   *        show:         Boolean to display the modal or not
   *        textBtn1:     Text of the first button (left one)
   *        handleBtn1:   Function associated with the first button
   *        textBtn2:     Text of the second button (right one)
   *        handleBtn2:   Function associated with the second button
   */

  return (
    <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-blue">{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 className="text-pink text-center">{props.mainText}</h3>
          <p className="text-pink text-center">{props.subText}</p>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          {props.handleBtn1 &&
            <button 
              type="button"
              className="btn btn-blue text-blue"
              onClick={props.handleBtn1}>{props.textBtn1}
            </button>
          }
          {props.handleBtn2 &&
            <button
              type="button"
              className="btn btn-pink text-pink"
              onClick={props.handleBtn2}>{props.textBtn2}
            </button>
          }
        </Modal.Footer>
      </Modal>
  )
}

export default PongModal;
