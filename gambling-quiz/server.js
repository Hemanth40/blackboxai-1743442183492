const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));
app.use(express.json());

// Quiz data
const quizQuestions = [
  {
    question: "How often do you think about gambling?",
    options: ["Never", "Occasionally", "Frequently", "Constantly"],
    scores: [0, 1, 2, 3]
  },
  {
    question: "Have you ever lied about your gambling?",
    options: ["Never", "Sometimes", "Often", "Always"],
    scores: [0, 1, 2, 3]
  },
  {
    question: "Do you gamble to escape problems?",
    options: ["Never", "Sometimes", "Often", "Always"],
    scores: [0, 1, 2, 3]
  }
];

// Quiz endpoints
app.get('/quiz-data', (req, res) => {
  res.json(quizQuestions);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
});

app.post('/submit-quiz', (req, res) => {
  const answers = req.body.answers;
  let totalScore = 0;
  
  answers.forEach((answer, index) => {
    totalScore += quizQuestions[index].scores[answer];
  });

  res.json({ 
    score: totalScore,
    maxScore: quizQuestions.length * 3,
    assessment: getAssessment(totalScore) 
  });
});

function getAssessment(score) {
  if(score <= 3) return "Low risk";
  if(score <= 6) return "Moderate risk"; 
  return "High risk - consider seeking help";
}

const PORT = 8001;
app.listen(PORT, () => {
  console.log(`Quiz server running on http://localhost:${PORT}`);
});