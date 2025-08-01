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

  useEffect(() => {
    setAnswers(Array(questions.length).fill(null));
  }, [questions]);

  useEffect(() => {
    fetch('http://localhost:4000/api/scores')
      .then(res => res.json())
      .then(data => {
        const top5 = data.sort((a, b) => b.score - a.score).slice(0, 5);
        setLeaderboard(top5);
      })
      .catch(err => {
        console.error('Error fetching leaderboard:', err);
      });
  }, [submitted]);

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
  
    // Send name and score to backend
    fetch('http://localhost:4000/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score: count }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          // Optionally show feedback to user
          console.log('Score saved:', data);
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

      <footer>
        <p>Copyright: www.mathinenglish.com</p>
      </footer>
    </div>
  );
}

export default App;
