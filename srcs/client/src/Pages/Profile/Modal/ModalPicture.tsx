import Modal from 'react-bootstrap/Modal';
import '../../../Components/Tools/Text.css';
import '../../../Components/Tools/Box.css';
import './ModalChangeContent.css';
import './form.css';
import FailAndSuccessPicture from './FailAndSuccessPicture';
import React, { useContext, useEffect, useState } from 'react';
import { postFetchPicture } from '../Fetch/postFetchPicture';
import { useForm } from 'react-hook-form';
import { GameSocketContext } from '../../Game/socket/socket';
import { UserContext } from '../../../Context/UserContext';

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
  showResponse,
  setShowResponse,
}: any) => {
  /**
   * @props title:        Title of the modal
   *        closeHandler: Function used to close the modal
   *        show:         Boolean to display the modal or not
   *        textBtn1:     Text of the first button (left one)
   *        handleBtn1:   Function associated with the first button
   *        textBtn2:     Text of the second button (right one)
   *        handleBtn2:   Function associated with the second button
   *        ShowResponse: Boolean to show or hide the response of action
   */

  const [url, setUrl] = useState('');
  const [status, setStatus] = useState(2);
  const socket = useContext(GameSocketContext);
  // Get current user
  const { user: currentUser } = useContext<{ user: { id: number } }>(
    UserContext,
  );
  const originalId = currentUser.id;

  // React hook form
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('picture', data.picture[0]);
    formData.append('user', originalId.toString());
    const status = postFetchPicture({ url: url, data: formData });
    status.then((responseObject) => {
      const contentType = responseObject.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        responseObject.json().then((res) => {
          if (res.apiStatusCode >= 400) {
            setStatus(0);
            setShowResponse(1);
            return;
          } else {
            socket.emit('updatePlayer', { pic: res.profilePicture });
            setStatus(1);
            setShowResponse(1);
            up();
            setTimeout(() => {
              closeHandler();
            }, 500);
          }
        }).catch((e) => {
          setStatus(0);
          setShowResponse(1);
          return;
        });
      } else {
        responseObject.text().then((res) => {
          setStatus(0);
          setShowResponse(1);
          return;
        }).catch((e) => {
          setStatus(0);
          setShowResponse(1);
          return;
        });
      }
    }).catch((e) => {
      setStatus(0);
      setShowResponse(1);
      return;
    });
  };

  useEffect(() => {
    setStatus(2);
    const apiUrl: string = process.env.REACT_APP_API_URL as string;
    setUrl(`${apiUrl}/pictures/`);
  }, []);

  return (
    <Modal show={show} onHide={closeHandler}>
      <Modal.Header closeButton>
        <Modal.Title className="text-blue">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-pink text-center ">
        <p className="text-pink">
          Your picture must be JPG / JPEG / PNG / GIF and must be less than 3MB
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          id="uploadPictureForm"
          className="d-flex justify-content-center"
        >
          <input
            {...register('picture')}
            required
            id="file-upload"
            type="file"
            className="form-control box-pink text-pink"
          />
        </form>
      </Modal.Body>
      <Modal.Footer className="modal-footer">
        {showResponse !== 1 ? '' : <FailAndSuccessPicture status={status} />}
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
