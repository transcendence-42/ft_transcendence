import '../Box.css';
import TREE from '../../../Pages/Profile/tree.jpg';

function PhotoProfil() {
  return (
    <>
      <div className="profilBox">
        <img src={TREE} alt="profil_picture"></img>
      </div>
    </>
  );
}

export default PhotoProfil;
