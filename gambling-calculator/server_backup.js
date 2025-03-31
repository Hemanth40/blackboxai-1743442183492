const express = require('express');
const app = express();
const path = require('path');

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Calculator endpoint
app.post('/calculate', (req, res) => {
  const { amount, frequency, years } = req.body;
  
  // Calculate total spent
  const totalSpent = amount * frequency * 52 * years;
  
  // Calculate potential investment growth (7% annual return)
  const potentialValue = totalSpent * Math.pow(1.07, years);
  
  res.json({
    totalSpent: totalSpent.toFixed(2),
    potentialValue: potentialValue.toFixed(2),
    difference: (potentialValue - totalSpent).toFixed(2)
  });
});

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

app.get('/quiz', (req, res) => {
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

// Serve calculator HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'calculator.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});