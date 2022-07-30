import { useState } from 'react';
import './App.css';

function PlayNumber(props) {
  return (
    <button className="number" onClick={() => alert(props.id)}>{props.id}</button>
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

function App() {
  const [stars, setStars] = useState(random(1, 9));
  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          <StarDisplay starsCount={stars} />
        </div>
        <div className="right">
          {range(1, 9).map(id =>
            <PlayNumber id={id} />
          )}
        </div>
      </div>
      <div className="timer">Time Remaining: 10</div>
    </div>
  );
};

const range = (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i);

const random = (min, max) => min + Math.floor(Math.random() * (max - min + 1));


export default App;