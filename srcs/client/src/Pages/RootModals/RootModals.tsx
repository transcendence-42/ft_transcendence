// React
import { useCallback, useContext, useEffect, useState } from 'react';
// Components
import PongModal from '../../Components/Modal/PongModal';
// Socket
import { SocketContext } from '../../socket';
// Styles
import '../../Styles';
import GameChallenge from './modals/GameChallenge';

const RootModals = () => {

  const socket = useContext(SocketContext);

  /** *********************************************************************** */
  /** ENUMS                                                                   */
  /** *********************************************************************** */
  
  enum eChallengeWho {
    CHALLENGER = 0,
    CHALLENGEE,
  }
  
  /** *********************************************************************** */
  /** MODAL                                                                   */
  /** *********************************************************************** */
  
  // Modal states
  const [showGameChallenge, setGameChallenge] = useState(false);

  // Modal event handlers
  const handleCloseGameChallenge = () => setGameChallenge(false);
  const handleShowGameChallenge = () => setGameChallenge(true);

  /** *********************************************************************** */
  /** SOCKET EVENTS HANDLERS                                                  */
  /** *********************************************************************** */
  
  // Socket events handlers
  const handleGameChallenge = useCallback((data: any) => {
    
  }, []);

  /** *********************************************************************** */
  /** COMPONENT EVENT HANDLERS                                                */
  /** *********************************************************************** */
  const handleRefuse = () => {
  }

  const handleAccept = () => {
    
  }

  /** *********************************************************************** */
  /** INITIALIZATION                                                          */
  /** *********************************************************************** */

  useEffect(() => {
    // Socket listeners
    socket.on('gameChallenge', handleGameChallenge);
    return () => {
      socket.off('gameChallenge', handleGameChallenge);
    };
  }, []);

  /** *********************************************************************** */
  /** RENDER                                                                  */
  /** *********************************************************************** */

  return (
    <>
      <PongModal
        title={`You are challenged !`}
        closeHandler={handleCloseGameChallenge}
        show={showGameChallenge}
        textBtn1="Refuse"
        handleBtn1={handleRefuse}
        textBtn2="Accept"
        handleBtn2={handleAccept}
      >
        <GameChallenge />
      </PongModal>
    </>
  );
};

export default RootModals;
