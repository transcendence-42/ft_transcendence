import React from 'react';
import '../../../Components/Tools/Text.css';
import '../../../Components/Tools/Box.css';
import '../profile.css';
import ModalPicture from '../Modal/ModalPicture';
import { useState } from 'react';

export default function ChangePicture(props: any) {
  /**
   * @props id:           ID of the user
   *        up:           function triggering a re-render
   * A button triggering a Modal for changing the user Picture
   */

  const [isShowing, setIsShowing] = useState(false);
  const [showResponse, setShowResponse] = useState(0);

  function toggle() {
    setShowResponse(0);
    setIsShowing(!isShowing);
  }
  return (
    <>
      <button
        className="btn btn-yellow m-1"
        style={{
          width: '100%',
          height: 'auto',
        }}
        onClick={() => toggle()}
      >
        <div className="yellowText" style={{ fontSize: '0.8em' }}>
          Change Picture
        </div>
      </button>
      <ModalPicture
        show={isShowing}
        closeHandler={toggle}
        textBtn1="Cancel"
        handleBtn1={toggle}
        textBtn2="Submit"
        handleBtn2={toggle}
        title="Upload your NEW Picture"
        id={props.id}
        up={props.up}
        showResponse={showResponse}
        setShowResponse={setShowResponse}
      />
    </>
  );
}
