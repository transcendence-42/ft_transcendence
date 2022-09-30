import React from 'react';

function PhotoProfil(props: any) {
  return (
    <img
      className="box-blue rounded-circle mx-auto d-block"
      src={props.url}
      style={{
        width: props.width,
        height: props.height,
      }}
      alt="IMG"
    ></img>
  );
}

export default PhotoProfil;
