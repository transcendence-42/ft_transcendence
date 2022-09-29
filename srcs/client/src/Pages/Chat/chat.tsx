import './chat.css';
import "../../Components/Tools/Box.css"

export default function Chat (props : any) {

    return (
      <>
      <div className="chat">
        <div className="blueBoxChat"
            style={{
            width: "20%",
            height: "80vh",
          }}>
          <div className="yellowPinkBoxChat"
          style={{
            width: "70%",
            height: "7%",
          }}>
            <div className="yellowTextChat" style={{fontSize: "2vw"}}> Channels </div>
          </div>
          <div className="friends">
            <div>
              <p className="name" style={{fontSize: "1vw"}}>Fred</p>
              <p className="name" style={{fontSize: "1vw"}}>Bob</p>
              <p className="name" style={{fontSize: "1vw"}}>Charly</p>
            </div>
          </div>
        </div>
        <div className="blueBoxChat"
            style={{
            width: "78%",
            height: "80vh",
          }}>
        </div>
      </div>
      </>
    );
}
