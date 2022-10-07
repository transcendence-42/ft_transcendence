import Modal from 'react-bootstrap/Modal';
import '../../../Components/Tools/Text.css';
import '../../../Components/Tools/Box.css';
import './ModalChangeContent.css';
import FailAndSuccessPicture from './FailAndSuccessPicture';
import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../../Game/socket/socket';
import { postFetchPicture } from '../Fetch/postFetchPicture';
import { useForm } from 'react-hook-form';

const ModalPicture = ({
  title,
  closeHandler,
  show,
  textBtn1,
  handleBtn1,
  textBtn2,
  handleBtn2,
  up,
  id,
}: any) => {
  /**
   * @props title:        Title of the modal
   *        closeHandler: Function used to close the modal
   *        show:         Boolean to display the modal or not
   *        textBtn1:     Text of the first button (left one)
   *        handleBtn1:   Function associated with the first button
   *        textBtn2:     Text of the second button (right one)
   *        handleBtn2:   Function associated with the second button
   */

  const [url, setUrl] = useState('');
  const [status, setStatus] = useState(2);
  const [socket, originalId] = useContext(SocketContext);

  // React hook form
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('picture', data.picture[0]);
    formData.append('user', originalId);
    const status = postFetchPicture({ url: url, data: formData });
    status.then((responseObject) => {
      if (responseObject.status === 400) {
        setStatus(0);
        return;
      }
      socket.emit('updatePlayer', { pic: 'updated' });
      setStatus(1);
      up();
      setTimeout(() => {
        closeHandler();
      }, 500);
    });
  };

  useEffect(() => {
    setStatus(2);
    setUrl(`http://127.0.0.1:4200/pictures/`);
  }, []);

  return (
    <Modal show={show} onHide={closeHandler}>
      <Modal.Header closeButton>
        <Modal.Title className="text-blue">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-pink text-center ">
        <form onSubmit={handleSubmit(onSubmit)} id="uploadPictureForm">
          <input
            {...register('picture')}
            required
            type="file"
            className="inputContent"
          />
        </form>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        {<FailAndSuccessPicture status={status} />}
        {handleBtn1 && (
          <button
            type="button"
            className="btn btn-blue text-blue"
            onClick={handleBtn1}
          >
            {textBtn1}
          </button>
        )}
        {handleBtn2 && (
          <input
            type="submit"
            className="btn btn-pink text-pink"
            form="uploadPictureForm"
            name={textBtn2}
          />
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPicture;
