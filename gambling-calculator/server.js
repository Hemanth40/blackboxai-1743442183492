const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const publicPath = path.resolve(__dirname, 'public');
console.log(`Serving static files from: ${publicPath}`);
const storiesFile = path.join(__dirname, 'stories.json');

// Initialize stories file
if (!fs.existsSync(storiesFile)) {
  fs.writeFileSync(storiesFile, '[]');
}

// Helper functions
function readStories() {
  return JSON.parse(fs.readFileSync(storiesFile));
}

function writeStories(stories) {
  fs.writeFileSync(storiesFile, JSON.stringify(stories, null, 2));
}

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

function getAssessment(score) {
  if(score <= 3) return "Low risk";
  if(score <= 6) return "Moderate risk"; 
  return "High risk - consider seeking help";
}

// Middleware
app.use(express.static(publicPath));
app.use(express.json());

// API Endpoints
app.get('/api/stories', (req, res) => {
  try {
    const stories = readStories();
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stories', (req, res) => {
  try {
    const stories = readStories();
    const newStory = {
      id: Date.now().toString(),
      name: req.body.name || 'Anonymous',
      story: req.body.story,
      amount: req.body.amount ? parseFloat(req.body.amount) : null,
      createdAt: new Date().toISOString()
    };
    stories.unshift(newStory);
    writeStories(stories);
    res.status(201).json(newStory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Quiz endpoints
app.get('/api/quiz', (req, res) => {
  res.json(quizQuestions);
});

app.post('/api/quiz', (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({ error: 'Invalid quiz submission' });
  }
});

// Serve HTML pages
app.get('/calculator', (req, res) => {
  res.sendFile(path.join(publicPath, 'calculator.html'));
});

app.get('/quiz', (req, res) => {
  const quizPath = path.resolve(publicPath, 'quiz.html');
  console.log(`Attempting to serve quiz from: ${quizPath}`);
  
  fs.access(quizPath, fs.constants.R_OK, (err) => {
    if (err) {
      console.error(`Error accessing quiz file: ${err}`);
      return res.status(404).send('Quiz page not found');
    }
    res.sendFile(quizPath, (err) => {
      if (err) {
        console.error(`Error sending file: ${err}`);
        res.status(500).send('Error loading quiz page');
      }
    });
  });
});

app.get('/stories', (req, res) => {
  res.sendFile(path.join(publicPath, 'stories.html'));
});

// Test endpoints
app.get('/test-plain', (req, res) => {
  res.send('Plain text test endpoint working');
});

app.get('/test-file', (req, res) => {
  const testPath = path.resolve(__dirname, 'public', 'quiz.html');
  console.log(`Test file path: ${testPath}`);
  res.sendFile(testPath, (err) => {
    if (err) {
      console.error('Test file error:', err);
      res.status(500).send('Error serving test file');
    }
  });
});

app.get('/', (req, res) => {
  res.redirect('/calculator');
});

// Debug static file serving
app.get('/debug', (req, res) => {
  const testFile = path.join(publicPath, 'quiz.html');
  res.send(`Static file path: ${testFile}<br>Exists: ${fs.existsSync(testFile)}`);
});

// Enhanced server startup with error handling
const PORT = 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});

// Add middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
