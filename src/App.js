import { useState, useEffect } from 'react';
import './App.css';

function PlayNumber(props) {
  return (
    <button
      className="number"
      style={{ backgroundColor: colors[props.status] }}
      onClick={() => props.onClick(props.id, props.status)}
    >
      {props.id}
    </button>
  );
}

function StarDisplay(props) {
  return (
    <>
      {range(1, props.starsCount).map(id =>
        <div key={id} className="star"></div>
      )}
    </>)
}

function PlayAgain(props) {
  return (
    <div className="game-done">
      <div 
    	className="message"
      style={{ color: props.gameStatus === 'lost' ? 'red' : 'green'}}>
  	  {props.gameStatus === 'lost' ? 'Game Over' : 'Nice'}
      </div>
      <button onClick={props.onClick}>Play Again</button>
    </div>
  );
}

const StarMatch = () => {
	const [gameId, setGameId] = useState(1);
	return <Game key={gameId} startNewGame={() => setGameId(gameId + 1)}/>;
}

function Game(props) {
  const [stars, setStars] = useState(random(1, 9));
  const [candidateNums, setCandidates] = useState([]);
  const [availableNums, setAvailable] = useState(range(1, 9));
  const [secondsLeft, setSecondsLeft] = useState(10);

  const candidatesAreWrong = sum(candidateNums) > stars;
  const gameStatus = availableNums.length === 0 
  ? 'won' 
  : secondsLeft === 0 ? 'lost' : 'active';

	useEffect(() => {
  	if (secondsLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
	      setSecondsLeft(secondsLeft - 1);
      }, 1000);
    	return () => clearTimeout(timerId);
  	}
  });  
  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'used';
    }
    if (candidateNums.includes(number)) {
      return candidatesAreWrong ? 'wrong' : 'candidate';
    }
    return 'available';
  };

  const onNumberClick = (number, currentStatus) => {
    if (currentStatus === 'used' || gameStatus !== 'active') {
      return;
    }

    const newCandidateNums =
      currentStatus === 'available'
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number);

    if (sum(newCandidateNums) !== stars) {
      setCandidates(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      setStars(randomSumIn(newAvailableNums, 9));
      setAvailable(newAvailableNums);
      setCandidates([]);
    }
  };

  return (
    <div className="game" id="game" >
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameStatus !== 'active' ? (<PlayAgain gameStatus={gameStatus} onClick={props.startNewGame} />) : (<StarDisplay starsCount={stars} />)}
        </div>
        <div className="right">
          {range(1, 9).map(id =>
            <PlayNumber
              key={id}
              onClick={(onNumberClick)}
              status={numberStatus(id)}
              id={id} />
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: {secondsLeft}</div>
    </div>
  );
};

const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

const range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

const random = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

const sum = (arr) => arr.reduce((acc, curr) => acc + curr, 0);

const randomSumIn = (arr, max) => {
  const sets = [[]];
  const sums = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0, len = sets.length; j < len; j++) {
      const candidateSet = sets[j].concat(arr[i]);
      const candidateSum = sum(candidateSet);
      if (candidateSum <= max) {
        sets.push(candidateSet);
        sums.push(candidateSum);
      }
    }
  }
  return sums[random(0, sums.length - 1)];
}

export default StarMatch;