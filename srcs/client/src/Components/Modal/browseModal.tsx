import { Children } from "react";
import Modal from "react-bootstrap/Modal";
import "../../Styles";

const BrowseModal = (props: any) => {
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
   *        select:       Multiple images associated with an action
   */

  return (
    <Modal
      show={props.show}
      onHide={props.closeHandler}
      size={props.size || ""}
    >
      <Modal.Header closeVariant="white" closeButton>
        <Modal.Title className="text-blue">{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.children}</Modal.Body>
    </Modal>
  );
};

export default BrowseModal;
