

function PhotoProfil(props : any) {
  return (
    <>
      <div className="profilBox">
        <img src={props.url} alt="profil_picture"></img>
      </div>
    </>
  );
}

export default PhotoProfil;
