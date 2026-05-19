import type { Question } from '../types/game';

const cicdQuestions: Question[] = [
  {
    id: 1,
    npcText:
      '"The Eternal Pipeline," Mimer announces, eyes blazing. "What is the PURPOSE of a CI/CD pipeline — why do warriors automate the forge?"',
    answers: [
      { text: 'To write code faster without tests', correct: false },
      { text: 'To automatically build, test, and deploy code on every change', correct: true },
      { text: 'To replace developers with machines', correct: false },
      { text: 'To store container images in a registry', correct: false },
    ],
    feedbackCorrect:
      '"Yes! CI builds and tests every change automatically; CD deploys it. The pipeline is your tireless war-machine — forging and shipping without rest."',
    feedbackWrong:
      '"CI/CD automatically builds, tests, and deploys code. Every commit triggers the pipeline — no warrior ships untested runes."',
    xpReward: 20,
  },
  {
    id: 2,
    npcText:
      'Mimer points to a rune-carved stone. "CI stands for Continuous Integration. What does INTEGRATION mean in this context?"',
    answers: [
      { text: 'Connecting microservices together in production', correct: false },
      { text: 'Integrating third-party APIs into your code', correct: false },
      { text: 'Frequently merging developer code into a shared branch and running tests', correct: true },
      { text: 'Installing dependencies from a package manager', correct: false },
    ],
    feedbackCorrect:
      '"Integration means uniting all warriors\' work into one branch — early and often — so conflicts are caught before they fester into battle."',
    feedbackWrong:
      '"CI = merging code frequently into a shared branch and immediately running tests. Catch conflicts early, not the night before release."',
    xpReward: 20,
  },
  {
    id: 3,
    npcText:
      '"In a GitHub Actions workflow," the smith rumbles, "what is a JOB?"',
    answers: [
      { text: 'A single shell command inside a step', correct: false },
      { text: 'The entire YAML file that defines the workflow', correct: false },
      { text: 'A set of steps that runs on one runner machine', correct: true },
      { text: 'A secret variable stored in the repository settings', correct: false },
    ],
    feedbackCorrect:
      '"A Job is a set of steps on one runner. Jobs in the same workflow can run in parallel or depend on each other."',
    feedbackWrong:
      '"A Job = a collection of steps that execute on a single runner. The workflow contains jobs; jobs contain steps."',
    xpReward: 20,
  },
  {
    id: 4,
    npcText:
      '"Your pipeline must only deploy to production when code is pushed to the MAIN branch," Mimer declares. "Which GitHub Actions keyword controls when a workflow runs?"',
    answers: [
      { text: 'trigger', correct: false },
      { text: 'when', correct: false },
      { text: 'on', correct: true },
      { text: 'run', correct: false },
    ],
    feedbackCorrect:
      '"The `on:` keyword! It defines the event runes — push, pull_request, schedule — that awaken the pipeline."',
    feedbackWrong:
      '"In GitHub Actions, `on:` defines the trigger events. Example: `on: push: branches: [main]`."',
    xpReward: 20,
  },
  {
    id: 5,
    npcText:
      '"You need to store a SECRET API KEY in your pipeline without exposing it in the YAML file," Mimer hisses. "Where do you keep it?"',
    answers: [
      { text: 'Hard-coded in the workflow YAML', correct: false },
      { text: 'In a .env file committed to the repository', correct: false },
      { text: 'In the repository or organisation Secrets settings, accessed via ${{ secrets.NAME }}', correct: true },
      { text: 'In a ConfigMap inside your Kubernetes cluster', correct: false },
    ],
    feedbackCorrect:
      '"Repository Secrets! Stored encrypted, injected at runtime as ${{ secrets.NAME }}. Never carve passwords into the rune-stone of your YAML."',
    feedbackWrong:
      '"Store secrets in GitHub Settings → Secrets. Reference them with ${{ secrets.MY_KEY }}. Never commit them to the repo."',
    xpReward: 20,
  },
  {
    id: 6,
    npcText:
      '"Continuous DELIVERY vs Continuous DEPLOYMENT," Mimer roars, shaking the rafters. "What is the KEY difference between the two?"',
    answers: [
      { text: 'Delivery uses Docker; Deployment uses Kubernetes', correct: false },
      { text: 'Delivery runs tests automatically; Deployment skips tests', correct: false },
      { text: 'Delivery requires a manual approval to release; Deployment releases automatically on every passing build', correct: true },
      { text: 'They are the same thing — different names for the same practice', correct: false },
    ],
    feedbackCorrect:
      '"Correct! Continuous Delivery keeps code release-ready but a human opens the gate. Continuous Deployment removes that gate — every green build ships automatically."',
    feedbackWrong:
      '"Delivery = manual release gate after tests pass. Deployment = fully automatic release on every passing build. One has a guardian; the other does not."',
    xpReward: 20,
  },
];

export default cicdQuestions;
