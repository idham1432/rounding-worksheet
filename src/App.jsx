import React, { useState } from 'react';
import { useEffect } from 'react';
import generateQuestions from './data/generateQuestions';
import QuestionCard from './components/QuestionCard';
import './styles.css';

function App() {
  const [questions, setQuestions] = useState(() => generateQuestions());
  const [answers, setAnswers] = useState([]);
  const [name, setName] = useState('');
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Utility to check if new score is a high score
  const isHighScore = (newScore) => {
    if (leaderboard.length === 0) return true;
    return newScore > Math.max(...leaderboard.map(entry => entry.score));
  };

  // Confetti function (calls the global confetti from the script)
  const launchConfetti = () => {
    if (typeof window.confetti === 'function') {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { x:0, y: 0.9 },
      });
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { x:1, y: 0.9 },
      });
    }
  };

  const fetchLeaderboard = () => {
    fetch('http://localhost:4000/api/scores')
      .then(res => res.json())
      .then(data => {
        const top5 = data.sort((a, b) => b.score - a.score).slice(0, 5);
        setLeaderboard(top5);
      })
      .catch(err => {
        console.error('Error fetching leaderboard:', err);
      });
  };

  useEffect(() => {
    setAnswers(Array(questions.length).fill(null));
  }, [questions]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const setAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const reset = () => {
    setQuestions(generateQuestions()); // triggers useEffect to reset answers
    setScore(null);
    setFeedback([]); // reset colors
    setSubmitted(false);
  };  

  const [feedback, setFeedback] = useState([]);
  
  const submit = () => {
    if (!name.trim()) return alert("Please enter your name!");
    let count = 0;
    const newFeedback = [];
  
    answers.forEach((ans, i) => {
      if (ans === questions[i].answer) {
        count++;
        newFeedback[i] = 'correct';
      } else {
        newFeedback[i] = 'incorrect';
      }
    });
  
    setScore(count);
    setFeedback(newFeedback);
    setSubmitted(true);
    setShowModal(true);
  
    // Send name and score to backend
    fetch('http://localhost:4000/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score: count }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          console.log('Score saved:', data);
          fetchLeaderboard();
          // Check if this is a high score
          if (isHighScore(count)) {
            launchConfetti();
          }
        }
      })
      .catch(err => {
        console.error('Error saving score:', err);
      });
  };

  return (
    <div className="container">
      <h1>Rounding Off to Nearest 10</h1>
      <div className="header">
        <label>
          Name: <input value={name} onChange={e => setName(e.target.value)} />
        </label>
        <span>Score: {score !== null ? score + " / " + questions.length : "-"}</span>
      </div>
      <p className="instruction">Circle the correct answers.</p>

      <div className="question-grid">
        {questions.map((q, i) => (
          <QuestionCard
            key={i}
            index={i}
            question={q}
            selected={answers[i]}
            setAnswer={setAnswer}
            status={feedback[i]}
            disabled={submitted} 
            submitted={submitted}
          />
        ))}
      </div>

      <div className="buttons">
        <button onClick={submit}>Submit</button>
        <button onClick={reset}>Reset</button>
      </div>

      <div className="leaderboard">
        <h2>Leaderboard</h2>
        <ol>
          {leaderboard.map((entry, i) => (
            <li key={entry._id || i}>
              <strong>{entry.name}</strong>: {entry.score}
            </li>
          ))}
        </ol>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>You scored {score} / {questions.length}</h2>
            <div className="modal-buttons">
              <button
                onClick={() => {
                  setShowModal(false);
                  reset(); // play again
                }}
              >
                Play Again
              </button>
              <button
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <footer>
        <p>Copyright: www.mathinenglish.com</p>
      </footer>
    </div>
  );
}

export default App;
