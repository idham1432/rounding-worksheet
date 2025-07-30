import React from 'react';

const QuestionCard = ({ index, question, selected, setAnswer, status, disabled, submitted }) => {
  const getCardStyle = () => {
    let base = 'question-card';
    if (status === 'correct') base += ' correct';
    if (status === 'incorrect') base += ' incorrect';
    if (submitted) base += ' submitted';
    return base;
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
              disabled={disabled}
            />
            {opt}
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
