import React from 'react';

const QuestionCard = ({ index, question, selected, setAnswer }) => {
  return (
    <div className="question-card">
      <p>{index + 1}. {question.question}</p>
      <div className="options">
        {question.options.map((opt, i) => (
          <label key={i}>
            <input
              type="radio"
              name={`q${index}`}
              value={opt}
              checked={selected === opt}
              onChange={() => setAnswer(index, opt)}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
