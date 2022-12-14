// React
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Components
import PongModal from '../../Components/Modal/PongModal';
// Socket
import { GameSocketContext } from '../Game/socket/socket';
// Styles
import '../../Styles';
import GameChallenge from './modals/GameChallenge';
import MatchMaking from './modals/MatchMaking';
import { RootModalsContext } from './RootModalsProvider';
import FirstConnection from './modals/FirstConnection';
import { UserContext } from '../../Context/UserContext';
import AlreadyConnected from './modals/AlreadyConnected';

const RootModals = ({ id }: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const socket = useContext(GameSocketContext);
  // Get current user
  const { user: currentUser } = useContext<{ user: { id: number } }>(
    UserContext,
  );
  const userId = currentUser.id;
  const navigate = useNavigate();

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
  const [showGameChallengeBtns, setShowGameChallengeBtns] = useState(true);
  const [
    showFirstConnection,
    setShowFirstConnection,
    showAlreadyConnected,
    setShowAlreadyConnected,
  ] = useContext(RootModalsContext);

  // Modal param states
  const [gameChallengeData, setGameChallengeData] = useState({} as any);

  // Modal event handlers
  const handleCloseGameChallenge = () => setShowGameChallenge(false);
  const handleShowGameChallenge = () => setShowGameChallenge(true);
  const handleCloseMatchMaking = () => setShowMatchMaking(false);
  const handleShowMatchMaking = () => setShowMatchMaking(true);
  const handleCloseFirstConnection = () => setShowFirstConnection(false);
  const handleShowFirstConnection = () => setShowFirstConnection(true);
  const handleCloseAlreadyConnected = () => setShowAlreadyConnected(true);
  const handleShowAlreadyConnected = () => setShowAlreadyConnected(true);

  /** *********************************************************************** */
  /** COMPONENT EVENT HANDLERS                                                */
  /** *********************************************************************** */

  // Challenge modal
  const handleCancel = useCallback(() => {
    handleCloseGameChallenge();
    if (gameChallengeData.opponent === undefined) return;
    socket.emit('updateChallenge', {
      id: gameChallengeData.opponent.userId.toString(),
      status: eChallengeStatus.CANCEL,
    });
  }, [eChallengeStatus.CANCEL, gameChallengeData, socket]);

  const handleRefuse = useCallback(() => {
    handleCloseGameChallenge();
    if (gameChallengeData.opponent === undefined) return;
    socket.emit('updateChallenge', {
      id: gameChallengeData.opponent.userId.toString(),
      status: eChallengeStatus.REFUSED,
    });
  }, [eChallengeStatus.REFUSED, gameChallengeData, socket]);

  const handleAccept = useCallback(() => {
    if (gameChallengeData.opponent === undefined) return;
    socket.emit('updateChallenge', {
      id: gameChallengeData.opponent.userId.toString(),
      status: eChallengeStatus.ACCEPTED,
    });
    setGameChallengeData({
      ...gameChallengeData,
      message: `You accepted the challenge :) ! Game will start in few seconds`,
    });
    setShowGameChallengeBtns(false);
    // move to lobby
    navigate('/lobby');
    // close modal
    setTimeout(() => {
      handleCloseGameChallenge();
    }, 2000);
  }, [eChallengeStatus.ACCEPTED, gameChallengeData, navigate, socket]);

  // First connection
  const handleGoToProfile = useCallback(() => {
    handleCloseFirstConnection();
    navigate(`/profile/${userId}`);
  }, [navigate, userId]);

  /** *********************************************************************** */
  /** SOCKET EVENTS HANDLERS                                                  */
  /** *********************************************************************** */

  const handleGameChallenge = useCallback(
    (data: any) => {
      // Show a different modal depending on if you are challenger or challengee
      if (data.who === eChallengeWho.CHALLENGER) {
        setGameChallengeData({
          title: `You are challenging a player !`,
          me: data.challenger,
          opponent: data.challengee,
          timer: data.timer,
          message: `You are challenging ${data.challengee.name} to a PONG game!`,
          is: eChallengeWho.CHALLENGER,
        });
      } else {
        setGameChallengeData({
          title: `You are challenged !`,
          opponent: data.challenger,
          timer: data.timer,
          message: `${data.challenger.name} is challenging you to a PONG game!`,
          is: eChallengeWho.CHALLENGEE,
        });
      }
      setShowGameChallengeBtns(true);
      handleShowGameChallenge();
    },
    [eChallengeWho.CHALLENGEE, eChallengeWho.CHALLENGER],
  );

  const handleGameChallengeReply = useCallback(
    (data: any) => {
      if (data.status === eChallengeStatus.CANCEL) {
        setShowGameChallengeBtns(false);
        setGameChallengeData({
          ...gameChallengeData,
          message: `${gameChallengeData.opponent.name} canceled his request :(`,
        });
      } else if (data.status === eChallengeStatus.REFUSED) {
        setShowGameChallengeBtns(false);
        setGameChallengeData({
          ...gameChallengeData,
          message: `${gameChallengeData.opponent.name} refused your challenge :(`,
        });
      } else if (data.status === eChallengeStatus.ACCEPTED) {
        setShowGameChallengeBtns(false);
        setGameChallengeData({
          ...gameChallengeData,
          message: `${gameChallengeData.opponent.name} accepted your challenge ! Game will start in few seconds`,
        });
        navigate('/lobby');
      }
      setTimeout(() => {
        handleCloseGameChallenge();
      }, 2000);
    },
    [
      eChallengeStatus.ACCEPTED,
      eChallengeStatus.CANCEL,
      eChallengeStatus.REFUSED,
      gameChallengeData,
      navigate,
    ],
  );

  const handleOpponentFound = useCallback(() => {
    handleShowMatchMaking();
    navigate('/lobby');
    setTimeout(() => {
      handleCloseMatchMaking();
    }, 2000);
  }, [navigate]);

  /** *********************************************************************** */
  /** INITIALIZATION                                                          */
  /** *********************************************************************** */

  useEffect(() => {
    socket.on('opponentFound', handleOpponentFound);
    return () => {
      socket.off('opponentFound', handleOpponentFound);
    };
  }, [handleOpponentFound, socket]);

  useEffect(() => {
    socket.on('gameChallenge', handleGameChallenge);
    socket.on('gameChallengeReply', handleGameChallengeReply);
    return () => {
      socket.off('gameChallenge', handleGameChallenge);
      socket.off('gameChallengeReply', handleGameChallengeReply);
    };
  }, [
    handleGameChallenge,
    handleGameChallengeReply,
    socket,
    handleAccept,
    handleCancel,
    handleRefuse,
    gameChallengeData,
  ]);

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
        textBtn1={
          gameChallengeData.is === eChallengeWho.CHALLENGEE
            ? 'Refuse'
            : 'Cancel'
        }
        handleBtn1={
          gameChallengeData.is === eChallengeWho.CHALLENGEE
            ? handleRefuse
            : handleCancel
        }
        textBtn2={
          gameChallengeData.is === eChallengeWho.CHALLENGEE
            ? 'Accept'
            : undefined
        }
        handleBtn2={
          gameChallengeData.is === eChallengeWho.CHALLENGEE
            ? handleAccept
            : undefined
        }
        closeButton={false}
        backdrop="static"
        showButtons={showGameChallengeBtns}
      >
        <GameChallenge message={gameChallengeData.message} />
      </PongModal>

      {/* Matchmaking */}
      <PongModal
        title="Matchmaking"
        closeHandler={handleCloseMatchMaking}
        show={showMatchMaking}
        closeButton={false}
      >
        <MatchMaking />
      </PongModal>

      {/* First connection */}
      <PongModal
        title="Welcome, ponger !"
        closeHandler={handleCloseFirstConnection}
        show={showFirstConnection}
        textBtn1="Nah I'm good"
        handleBtn1={handleCloseFirstConnection}
        textBtn2="Go to my profile !"
        handleBtn2={handleGoToProfile}
        closeButton={false}
        backdrop="static"
      >
        <FirstConnection />
      </PongModal>

      {/* Already connected */}
      <PongModal
        title="You are already connected"
        closeHandler={handleCloseAlreadyConnected}
        show={showAlreadyConnected}
        closeButton={false}
        backdrop="static"
      >
        <AlreadyConnected />
      </PongModal>
    </>
  );
};

export default RootModals;
