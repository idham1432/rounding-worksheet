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

  useEffect(() => {
    setAnswers(Array(questions.length).fill(null));
  }, [questions]);

  const setAnswer = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const reset = () => {
    setQuestions(generateQuestions()); // triggers useEffect to reset answers
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
      <p className="instruction">Circle the correct answers.</p>

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
