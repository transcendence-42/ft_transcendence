import Modal from 'react-bootstrap/Modal';
import '../../Styles';

const PongModal = (props: any) => {
  /**
   * @props title:        Title of the modal
   *        closeHandler: Function used to close the modal
   *        show:         Boolean to display the modal or not
   *        textBtn1:     Text of the first button (left one)
   *        handleBtn1:   Function associated with the first button
   *        textBtn2:     Text of the second button (right one)
   *        handleBtn2:   Function associated with the second button
   *        backdrop:     Control if a click outside close the modal or not
   *        closeButton:  Boolean to authorize close button on top right or not
   */

  return (
    <Modal
      show={props.show}
      onHide={props.closeHandler}
      size={props.size || ''}
      backdrop={props.backdrop || ''}
    >
      <Modal.Header closeButton={props.closeButton || true}>
        <Modal.Title className="text-blue">{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
      <Modal.Footer className="modal-footer">
        {props.handleBtn1 && (
          <button
            type="button"
            className="btn btn-blue text-blue"
            onClick={props.handleBtn1}
          >
            {props.textBtn1}
          </button>
        )}
        {props.handleBtn2 && (
          <button
            type="button"
            className="btn btn-pink text-pink"
            onClick={props.handleBtn2}
          >
            {props.textBtn2}
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PongModal;
