import type { Question } from '../types/game';

const dockerQuestions: Question[] = [
  {
    id: 1,
    npcText:
      '"Young forge-apprentice," growls Mimer, sparks leaping from the anvil, "what rune do you speak to summon a living container from an image?"',
    answers: [
      { text: 'docker start', correct: false },
      { text: 'docker run', correct: true },
      { text: 'docker spawn', correct: false },
      { text: 'docker create', correct: false },
    ],
    feedbackCorrect:
      '"Aye! docker run breathes life into the image — a soul bound to iron, marching at your command."',
    feedbackWrong:
      '"Fool! docker run is the rune of summoning. The others are lesser incantations."',
    xpReward: 20,
  },
  {
    id: 2,
    npcText:
      'Mimer sets down his hammer. "Tell me, wanderer — what is the difference between an IMAGE and a CONTAINER in the ways of Docker?"',
    answers: [
      {
        text: 'They are the same — just different names for the same thing',
        correct: false,
      },
      {
        text: 'An image is a running process; a container is a frozen blueprint',
        correct: false,
      },
      {
        text: 'An image is an immutable blueprint; a container is a live running process',
        correct: true,
      },
      { text: 'A container holds multiple images inside it', correct: false },
    ],
    feedbackCorrect:
      '"Well spoken! The image is the rune-stone — unchanging, eternal. The container is the warrior it conjures — living, breathing, mortal."',
    feedbackWrong:
      '"No! The image is the eternal blueprint — carved in stone. The container is the fleeting warrior it calls forth."',
    xpReward: 20,
  },
  {
    id: 3,
    npcText:
      '"Every Dockerfile must begin with a First Rune," Mimer whispers. "What is this sacred instruction that declares the base image?"',
    answers: [
      { text: 'BASE', correct: false },
      { text: 'START', correct: false },
      { text: 'FROM', correct: true },
      { text: 'IMAGE', correct: false },
    ],
    feedbackCorrect:
      '"FROM — the First Rune! It binds your creation to its ancestor, the root from which all containers grow."',
    feedbackWrong:
      '"Nay! FROM is the First Rune of every Dockerfile. Without it, your creation has no lineage."',
    xpReward: 20,
  },
  {
    id: 4,
    npcText:
      'The old smith peers into the darkness. "Which command reveals ALL containers — even those who have fallen silent and stopped breathing?"',
    answers: [
      { text: 'docker ps', correct: false },
      { text: 'docker list --all', correct: false },
      { text: 'docker containers show', correct: false },
      { text: 'docker ps -a', correct: true },
    ],
    feedbackCorrect:
      '"docker ps -a — it reads both the living AND the dead. No container can hide from its gaze."',
    feedbackWrong:
      '"docker ps -a is the spell you seek. Without the -a flag, the stopped ones remain invisible."',
    xpReward: 20,
  },
  {
    id: 5,
    npcText:
      '"Sometimes a warrior\'s body must be destroyed completely," Mimer mutters grimly. "Which rune permanently removes a container\'s corpse?"',
    answers: [
      { text: 'docker stop', correct: false },
      { text: 'docker kill', correct: false },
      { text: 'docker delete', correct: false },
      { text: 'docker rm', correct: true },
    ],
    feedbackCorrect:
      '"docker rm — swift and final. It erases the container\'s remains. What is gone cannot return."',
    feedbackWrong:
      '"docker rm is the death-rune. stop and kill merely silence the warrior — rm destroys the body entirely."',
    xpReward: 20,
  },
  {
    id: 6,
    npcText:
      '"The Bifrost Bridge!" Mimer thunders. "When you write -p 8080:80, what gates are you opening between the container and the outside world?"',
    answers: [
      {
        text: 'Port 80 on your machine connects to port 8080 inside the container',
        correct: false,
      },
      {
        text: 'Port 8080 on your machine connects to port 80 inside the container',
        correct: true,
      },
      { text: 'Both ports 8080 and 80 are opened on your machine', correct: false },
      {
        text: 'The container can access the host on port 8080',
        correct: false,
      },
    ],
    feedbackCorrect:
      '"Aye! -p hostPort:containerPort — 8080 on your realm bridges to 80 inside the container\'s world. The Bifrost holds!"',
    feedbackWrong:
      '"-p 8080:80 maps YOUR port 8080 to the container\'s port 80. The first number is always the host, the second — the container."',
    xpReward: 20,
  },
];

export default dockerQuestions;
