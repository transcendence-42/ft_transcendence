import "../../Components/Tools/Box.css"
import "../../Components/Tools/Text.css"
import './Game.css'
import Modal from 'react-bootstrap/Modal';

const GameModal = (props: any) => {

  return (
    <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-blue">Go back to lobby</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3 className="text-pink text-center">Warning: Do you confirm ?</h3>
          <p className="text-pink text-center">This action will cause you to lose the game if started, or cancel it if not started.</p>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <button type="button" className="btn btn-blue text-blue" onClick={props.handleClose}>Cancel</button>
          <button type="button" className="btn btn-pink text-pink" onClick={props.handleBackToLobby}>Go back to lobby</button>
        </Modal.Footer>
      </Modal>
  )
}

export default GameModal;
