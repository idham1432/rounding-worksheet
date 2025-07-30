import React, { useState } from 'react';
import questions from './data/questions';
import QuestionCard from './components/QuestionCard';
import './styles.css';

function App() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [name, setName] = useState('');
  const [score, setScore] = useState(null);

  const setAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const reset = () => {
    setAnswers(Array(questions.length).fill(null));
    setScore(null);
  };

  const submit = () => {
    if (!name.trim()) return alert("Please enter your name!");
    let count = 0;
    answers.forEach((ans, i) => {
      if (ans === questions[i].answer) count++;
    });
    setScore(count);
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

      <div className="question-grid">
        {questions.map((q, i) => (
          <QuestionCard
            key={i}
            index={i}
            question={q}
            selected={answers[i]}
            setAnswer={setAnswer}
          />
        ))}
      </div>


      <div className="buttons">
        <button onClick={submit}>Submit</button>
        <button onClick={reset}>Reset</button>
      </div>

      <footer>
        <p>Copyright: www.mathinenglish.com</p>
      </footer>
    </div>
  );
}

export default App;
