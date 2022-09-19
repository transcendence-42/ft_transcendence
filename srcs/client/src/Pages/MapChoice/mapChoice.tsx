import { Link } from "react-router-dom";
import './mapChoice.css';
import "../../Components/Tools/Box.css"
import "../../Components/Tools/Text.css"
import "../../Components/Tools/VirtualPong/virtualPong.css"

/*
** Simple display of the choice of maps 
*/
export default function MapChoice () {
    return (
        <>
          <div className="titleChoiceMap" data-testid="tracker">
            <h2 className="pinkText " style={{fontSize: "4vw"}}>CHOOSE A MAP</h2>
          </div>
          <div className="mainFrame">
            <div className="frame1">
              <Link to={"/matchmaking"}>
              <div className="field" style={{margin: "auto", height:"90%", width:"80%"}}>
                <div className="net"></div>
                <div className="ping"></div>
                <div className="pong"></div>
                <div className="ball"></div>
              </div> 
              </Link>
            </div>
            <div className="frame2" style={{ }}  >
            <Link to={"/matchmaking"}>
            <div className="field" style={{margin: "auto", height:"90%", width:"80%",borderColor:"white", boxShadow:	"0px 0px 7.49518px wheat, 0px 0px 7.49518px wheat, 0px 0px 7.49518px wheat"}}>
                <div className="net" style={{borderColor:"white", boxShadow:	"0px 0px 7.49518px wheat, 0px 0px 7.49518px wheat, 0px 0px 7.49518px wheat"}}></div>
                <div className="ping" style={{borderColor:"white", background:"white"}}></div>
                <div className="pong"style={{borderColor:"white", background:"white"}}></div>
                <div className="ball" style={{borderColor:"white", background:"white"}}></div>
              </div> 
              </Link>
            </div>
            
            <div className="frame3">
            <Link to={"/matchmaking"}>
            <div className="field" style={{margin: "auto",height:"90%", width:"80%", borderColor:"white",  boxShadow:	"0px 0px 7.49518px wheat, 0px 0px 7.49518px wheat, 0px 0px 7.49518px wheat",}}>
            <div className="net" style={{borderColor:"white", boxShadow:	"0px 0px 7.49518px wheat, 0px 0px 7.49518px wheat, 0px 0px 7.49518px wheat"}}></div>
                <div className="ping" style={{borderColor:"white", background:"white"}}></div>
                <div className="pong"style={{borderColor:"white", background:"white"}}></div>
                <div className="ball" style={{borderColor:"white", background:"white"}}></div>
              </div> 
              </Link>
            </div>
            
            <div className="frame4">
            <Link to={"/matchmaking"}>
            <div className="field" style={{margin: "auto",height:"90%", width:"80%"}}>
                <div className="net" ></div>
                <div className="ping"></div>
                <div className="pong"></div>
                <div className="ball"></div>
              </div> 
              </Link>
            </div>
          </div>
   
         </>
    );
}
