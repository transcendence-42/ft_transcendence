// React
import { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Components
import PongModal from '../../Components/Modal/PongModal';
// Socket
import { SocketContext } from '../Game/socket/socket';
// Styles
import '../../Styles';
import GameChallenge from './modals/GameChallenge';
import MatchMaking from './modals/MatchMaking';

const RootModals = () => {
  const [socket, userId] = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();

  /** *********************************************************************** */
  /** ENUMS                                                                   */
  /** *********************************************************************** */

  enum eChallengeWho {
    CHALLENGER = 0,
    CHALLENGEE,
  }

  enum eChallengeStatus {
    OPEN = 0,
    ACCEPTED,
    REFUSED,
    CANCEL,
  }

  /** *********************************************************************** */
  /** MODAL                                                                   */
  /** *********************************************************************** */

  // Modal states (from useState or useContext)
  const [showGameChallenge, setShowGameChallenge] = useState(false);
  const [showMatchMaking, setShowMatchMaking] = useState(false);

  // Modal param states
  const [gameChallengeData, setGameChallengeData] = useState({} as any);

  // Modal event handlers
  const handleCloseGameChallenge = () => setShowGameChallenge(false);
  const handleShowGameChallenge = () => setShowGameChallenge(true);
  const handleCloseMatchMaking = () => setShowMatchMaking(false);
  const handleShowMatchMaking = () => setShowMatchMaking(true);

  /** *********************************************************************** */
  /** COMPONENT EVENT HANDLERS                                                */
  /** *********************************************************************** */

  const handleCancel = () => {
    handleCloseGameChallenge();
    socket.emit('updateChallenge', {
      id: gameChallengeData.opponent.userId.toString(),
      status: eChallengeStatus.CANCEL,
    });
  };

  const handleRefuse = () => {
    handleCloseGameChallenge();
    socket.emit('updateChallenge', {
      id: gameChallengeData.opponent.userId.toString(),
      status: eChallengeStatus.REFUSED,
    });
  };

  const handleAccept = () => {
    socket.emit('updateChallenge', {
      id: gameChallengeData.opponent.userId.toString(),
      status: eChallengeStatus.ACCEPTED,
    });
    setGameChallengeData({
      ...gameChallengeData,
      message: `You accepted the challenge :) ! Game will start in few seconds`,
    });
    // move to lobby
    navigate('/lobby');
    // close modal
    setTimeout(() => {
      handleCloseGameChallenge();
    }, 2000);
  };

  /** *********************************************************************** */
  /** SOCKET EVENTS HANDLERS                                                  */
  /** *********************************************************************** */

  // Socket events handlers
  const handleGameChallenge = useCallback((data: any) => {
    handleShowGameChallenge();
    // Show a different modal depending on if you are challenger or challengee
    if (data.who === eChallengeWho.CHALLENGER) {
      setGameChallengeData({
        title: `You are challenging a player !`,
        me: data.challenger,
        opponent: data.challengee,
        timer: data.timer,
        message: `You are challenging ${data.challengee.name} to a PONG game!`,
        btn1Text: `Cancel`,
        btn1Handler: handleCancel,
        btn2Text: undefined,
        btn2Handler: undefined,
      });
    } else {
      setGameChallengeData({
        title: `You are challenged !`,
        opponent: data.challenger,
        timer: data.timer,
        message: `${data.challenger.name} is challenging you to a PONG game!`,
        btn1Text: `Refuse`,
        btn1Handler: handleRefuse,
        btn2Text: `Accept`,
        btn2Handler: handleAccept,
      });
    }
  }, [handleAccept, handleCancel, handleRefuse]);

  const handleGameChallengeReply = useCallback((data: any) => {
    if (data.status === eChallengeStatus.CANCEL) {
      setGameChallengeData({
        ...gameChallengeData,
        message: `${gameChallengeData.opponent.name} canceled his request :(`,
      });
    } else if (data.status === eChallengeStatus.REFUSED) {
      setGameChallengeData({
        ...gameChallengeData,
        message: `${gameChallengeData.opponent.name} refused your challenge :(`,
      });
    } else if (data.status === eChallengeStatus.ACCEPTED) {
      setGameChallengeData({
        ...gameChallengeData,
        message: `${gameChallengeData.opponent.name} accepted your challenge ! Game will start in few seconds`,
      });
      navigate('/lobby');
    }
    setTimeout(() => {
      handleCloseGameChallenge();
    }, 2000);
  }, [eChallengeStatus.ACCEPTED, eChallengeStatus.CANCEL, eChallengeStatus.REFUSED, gameChallengeData, navigate]);

  const handleOpponentFound = useCallback(() => {
    handleShowMatchMaking();
    navigate('/lobby');
    setTimeout(() => {
      handleCloseMatchMaking();
    }, 2000);
  }, []);

  /** *********************************************************************** */
  /** INITIALIZATION                                                          */
  /** *********************************************************************** */

  useEffect(() => {
  socket.on('opponentFound', handleOpponentFound);
    return () => {
      socket.off('opponentFound', handleOpponentFound);
    }
  }, [handleOpponentFound]);

  useEffect(() => {
    socket.on('gameChallenge', handleGameChallenge);
    socket.on('gameChallengeReply', handleGameChallengeReply);
    return () => {
      socket.off('gameChallenge', handleGameChallenge);
      socket.off('gameChallengeReply', handleGameChallengeReply);
    };
  }, [handleGameChallenge, handleGameChallengeReply]);

  /** *********************************************************************** */
  /** RENDER                                                                  */
  /** *********************************************************************** */

  return (
    <>
      {/* Challenge */}
      <PongModal
        title={gameChallengeData.title}
        closeHandler={handleCloseGameChallenge}
        show={showGameChallenge}
        textBtn1={gameChallengeData.btn1Text}
        handleBtn1={gameChallengeData.btn1Handler}
        textBtn2={gameChallengeData.btn2Text}
        handleBtn2={gameChallengeData.btn2Handler}
        closeButton={false}
        backdrop="static"
      >
        <GameChallenge message={gameChallengeData.message} />
      </PongModal>

      {/* Matchmaking */}
       <PongModal
        title="Matchmaking"
        closeHandler={handleCloseMatchMaking}
        show={showMatchMaking}
      >
        <MatchMaking />
      </PongModal>
    </>
  );
};

export default RootModals;
