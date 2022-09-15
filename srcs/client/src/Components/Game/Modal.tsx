import "../../Components/Tools/Box.css"
import "../../Components/Tools/Text.css"
import './Game.css'

const Modal = (props: any) => {

  return (
    <div className="modal fade" id="gameModal" tabIndex={-1} aria-labelledby="goBackLobby" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title text-blue" id="goBackLobby">Go back to lobby</h5>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p className="text-pink">Warning: Do you confirm ?<br />This action will cause you to lose the game if started, or cancel it if not started.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-blue text-blue" data-bs-dismiss="modal">Cancel</button>
          <button type="button" className="btn btn-pink text-pink" onClick={props.handleBackToLobby}>Go back to lobby</button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default Modal;
