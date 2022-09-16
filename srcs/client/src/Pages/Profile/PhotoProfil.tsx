

function PhotoProfil(props : any) {

  return (
    <>
      <div className="profilBox" style={{
				width: props.width,
				height: props.height,
			}}>
        <img src={props.url} alt="IMG"></img>
      </div>
    </>
  );
}

export default PhotoProfil;
