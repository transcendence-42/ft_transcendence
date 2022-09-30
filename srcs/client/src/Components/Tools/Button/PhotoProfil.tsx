import React from 'react'
function PhotoProfil(props : any) {

  return (
    <>
      <div className="profilBox box-blue rounded-circle" style={{
				width: props.width,
				height: props.height,
			}}>
        <img className="rounded-circle" src={props.url} alt="IMG"></img>
      </div>
    </>
  );
}

export default PhotoProfil;
