import React from 'react';

const QuestionCard = ({ index, question, selected, setAnswer, status }) => {
  const getCardStyle = () => {
    if (status === 'correct') return 'question-card correct';
    if (status === 'incorrect') return 'question-card incorrect';
    return 'question-card';
  };

  return (
    <div className={getCardStyle()}>
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
