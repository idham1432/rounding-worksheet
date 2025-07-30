function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roundToNearest10(n) {
  return Math.round(n / 10) * 10;
}

function generateQuestions(count = 12) {
  const questions = [];

  for (let i = 0; i < count; i++) {
    const number = getRandomInt(0, 999);
    const correct = roundToNearest10(number);

    // Generate two incorrect options
    const distractors = new Set();
    while (distractors.size < 2) {
      let option = correct + getRandomInt(-30, 30);
      option = roundToNearest10(option);
      if (option !== correct && option >= 0 && option <= 1000) {
        distractors.add(option);
      }
    }

    const allOptions = Array.from(distractors);
    allOptions.push(correct);

    // Shuffle options
    const shuffled = allOptions.sort(() => Math.random() - 0.5);

    questions.push({
      number,
      question: `${number} rounded off to the nearest 10 is..`,
      options: shuffled.map(String),
      answer: String(correct),
    });
  }

  return questions;
}

export default generateQuestions;
