const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Level = require('./models/Level');
const StudyMaterial = require('./models/StudyMaterial');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:password123@localhost:27017/gamified_edu?authSource=admin';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected. Seeding...');

  await User.deleteMany({});
  await Level.deleteMany({});
  await StudyMaterial.deleteMany({});

  // Teacher
  await User.create({ name: 'Sharma Sir', regNo: 'TCH001', password: 'teacher123', role: 'teacher' });
  console.log('Teacher created: TCH001 / teacher123');

  // Students
  await User.create([
    { name: 'Ravi Kumar',   regNo: '12210001', password: 'student123', role: 'student', class: 1 },
    { name: 'Priya Singh',  regNo: '12210002', password: 'student123', role: 'student', class: 2 },
    { name: 'Amit Verma',   regNo: '12210003', password: 'student123', role: 'student', class: 3 },
    { name: 'Sneha Gupta',  regNo: '12210004', password: 'student123', role: 'student', class: 4 },
  ]);
  console.log('Students created: 12210001-12210004 / student123');

  // Class 1 Levels
  await Level.create([
    {
      levelNumber: 1, class: 1, subject: 'Mathematics',
      title: 'Number Friends', description: 'Learn numbers 1–10!',
      badge: '⭐ Number Star', stars: 1,
      questions: [
        { question: 'What comes after 5?', options: ['4', '6', '7', '8'], correct: 1, points: 10 },
        { question: 'How many fingers on one hand?', options: ['4', '6', '5', '3'], correct: 2, points: 10 },
        { question: 'What is 2 + 3?', options: ['4', '5', '6', '7'], correct: 1, points: 10 },
        { question: 'Which is the biggest number? 3, 7, 1, 5', options: ['3', '1', '5', '7'], correct: 3, points: 10 },
      ],
      passingScore: 60, timeLimit: 180
    },
    {
      levelNumber: 2, class: 1, subject: 'English',
      title: 'Alphabet Adventure', description: 'Master A-Z letters!',
      badge: '📚 Letter Hero', stars: 1,
      questions: [
        { question: 'What letter comes after A?', options: ['C', 'B', 'D', 'E'], correct: 1, points: 10 },
        { question: 'Which word starts with "C"?', options: ['Dog', 'Apple', 'Cat', 'Ball'], correct: 2, points: 10 },
        { question: 'How many letters in "CAT"?', options: ['2', '4', '3', '5'], correct: 2, points: 10 },
        { question: '"A" is a ...?', options: ['Number', 'Color', 'Letter', 'Shape'], correct: 2, points: 10 },
      ],
      passingScore: 60, timeLimit: 180
    },
    {
      levelNumber: 3, class: 1, subject: 'Science',
      title: 'Nature Explorer', description: 'Discover plants and animals!',
      badge: '🌿 Nature Champion', stars: 2,
      questions: [
        { question: 'What do plants need to grow?', options: ['Sugar', 'Sunlight', 'Milk', 'Salt'], correct: 1, points: 10 },
        { question: 'Which animal says "Moo"?', options: ['Dog', 'Cat', 'Cow', 'Bird'], correct: 2, points: 10 },
        { question: 'How many legs does a spider have?', options: ['6', '4', '8', '10'], correct: 2, points: 10 },
        { question: 'What color is grass?', options: ['Blue', 'Red', 'Yellow', 'Green'], correct: 3, points: 10 },
      ],
      passingScore: 60, timeLimit: 180
    },
  ]);

  // Class 2 Levels
  await Level.create([
    {
      levelNumber: 1, class: 2, subject: 'Mathematics',
      title: 'Addition Master', description: 'Level up your addition skills!',
      badge: '➕ Addition Master', stars: 1,
      questions: [
        { question: 'What is 12 + 8?', options: ['18', '20', '22', '15'], correct: 1, points: 10 },
        { question: 'What is 15 - 7?', options: ['9', '8', '7', '6'], correct: 1, points: 10 },
        { question: '5 × 4 = ?', options: ['18', '25', '20', '15'], correct: 2, points: 10 },
        { question: 'What is 30 ÷ 5?', options: ['4', '7', '5', '6'], correct: 3, points: 10 },
      ],
      passingScore: 60, timeLimit: 200
    },
    {
      levelNumber: 2, class: 2, subject: 'English',
      title: 'Word Wizard', description: 'Build your vocabulary!',
      badge: '🔤 Word Wizard', stars: 1,
      questions: [
        { question: 'Opposite of "big" is?', options: ['Large', 'Small', 'Tall', 'Wide'], correct: 1, points: 10 },
        { question: 'Which is a fruit?', options: ['Carrot', 'Potato', 'Mango', 'Onion'], correct: 2, points: 10 },
        { question: '"The cat sits on the mat." How many words?', options: ['5', '7', '6', '8'], correct: 2, points: 10 },
        { question: 'Plural of "child" is?', options: ['Childs', 'Childes', 'Children', 'Childrens'], correct: 2, points: 10 },
      ],
      passingScore: 60, timeLimit: 200
    },
  ]);

  // Study Materials
  await StudyMaterial.create([
    { class: 1, subject: 'Mathematics', type: 'video', title: 'Counting 1 to 20', description: 'Fun counting video for kids', link: 'https://www.youtube.com/embed/DR-cfDsHCGA' },
    { class: 1, subject: 'English', type: 'video', title: 'ABC Song for Kids', description: 'Learn all 26 letters with songs', link: 'https://www.youtube.com/embed/75p-N9YKqNo' },
    { class: 1, subject: 'Science', type: 'video', title: 'Animals and Their Sounds', description: 'Learn about different animals', link: 'https://www.youtube.com/embed/po4URKwmIoI' },
    { class: 1, subject: 'Mathematics', type: 'notes', title: 'Numbers 1–20 Chart', description: 'Printable number reference chart', link: '#' },
    { class: 2, subject: 'Mathematics', type: 'video', title: 'Addition and Subtraction', description: 'Learn basic arithmetic operations', link: 'https://www.youtube.com/embed/AuX7nPBqDts' },
    { class: 2, subject: 'English', type: 'video', title: 'Simple Sentences', description: 'Build simple English sentences', link: 'https://www.youtube.com/embed/VrPUNP3TMHo' },
    { class: 3, subject: 'Mathematics', type: 'video', title: 'Multiplication Tables', description: '2x to 10x multiplication tables', link: 'https://www.youtube.com/embed/mvOkMYCygps' },
    { class: 4, subject: 'Science', type: 'video', title: 'The Solar System', description: 'Planets and our solar system', link: 'https://www.youtube.com/embed/libKVRa01L8' },
  ]);

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
