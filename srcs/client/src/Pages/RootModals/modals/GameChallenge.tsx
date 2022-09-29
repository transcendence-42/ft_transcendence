const GameChallenge = (props: any) => {
  return (
    <>
      <h3 className="text-pink text-center">New game challenge !</h3>
      <p className="text-pink text-center">
        {props.message}
      </p>
    </>
  )
}

export default GameChallenge;
