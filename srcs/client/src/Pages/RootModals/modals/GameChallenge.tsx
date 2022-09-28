import { FC } from 'react';

const GameChallenge: FC = (props: any) => {
  return (
    <>
      <h3 className="text-pink text-center">New game challenge !</h3>
      <p className="text-pink text-center">
        {props.opponent} wants to PONG you! Will you accept the challenge?
      </p>
    </>
  )
}

export default GameChallenge;
