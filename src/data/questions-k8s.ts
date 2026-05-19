import type { Question } from '../types/game';

const k8sQuestions: Question[] = [
  {
    id: 1,
    npcText:
      '"Welcome to the Nine Kingdoms," Mimer intones, eyes gleaming. "In Kubernetes, what is the SMALLEST deployable unit — the atom of the cluster?"',
    answers: [
      { text: 'Container', correct: false },
      { text: 'Pod', correct: true },
      { text: 'Node', correct: false },
      { text: 'Deployment', correct: false },
    ],
    feedbackCorrect:
      '"The Pod! One or more containers sharing a network and storage — a longship crew sailing together or not at all."',
    feedbackWrong:
      '"A Pod is the smallest unit. Containers live inside Pods; a Pod is what Kubernetes schedules and tracks."',
    xpReward: 20,
  },
  {
    id: 2,
    npcText:
      'Mimer traces a rune in the air. "A NODE in Kubernetes — what manner of beast is it?"',
    answers: [
      { text: 'A running container inside a Pod', correct: false },
      { text: 'A configuration file that describes desired state', correct: false },
      { text: 'A physical or virtual machine that runs Pods', correct: true },
      { text: 'A load balancer that routes traffic to Pods', correct: false },
    ],
    feedbackCorrect:
      '"Aye — a Node is a warrior in your army: a real machine, physical or cloud-born, that carries Pods on its back."',
    feedbackWrong:
      '"A Node is the actual machine — VM or bare metal — where Pods are scheduled and run."',
    xpReward: 20,
  },
  {
    id: 3,
    npcText:
      '"You wish three replicas of your Pod to always stand guard," Mimer growls, slamming the anvil. "Which object do you forge to ensure the fallen are always replaced?"',
    answers: [
      { text: 'Service', correct: false },
      { text: 'ConfigMap', correct: false },
      { text: 'Deployment', correct: true },
      { text: 'Namespace', correct: false },
    ],
    feedbackCorrect:
      '"A Deployment! It watches your Pods like a jarl watches his warriors — if one falls, it raises another immediately."',
    feedbackWrong:
      '"A Deployment manages replicas and self-healing. It ensures the desired number of Pods always runs."',
    xpReward: 20,
  },
  {
    id: 4,
    npcText:
      '"Pods are mortal — their IP addresses perish with them," Mimer warns. "What object gives your warriors a STABLE address so others can always find them?"',
    answers: [
      { text: 'Ingress', correct: false },
      { text: 'Pod', correct: false },
      { text: 'ConfigMap', correct: false },
      { text: 'Service', correct: true },
    ],
    feedbackCorrect:
      '"A Service! A steady beacon in the storm — one DNS name and IP that lives on, no matter how many Pods rise and fall beneath it."',
    feedbackWrong:
      '"A Service provides a stable endpoint. It load-balances across Pods and keeps the address constant even as Pods restart."',
    xpReward: 20,
  },
  {
    id: 5,
    npcText:
      'The smith lowers his voice. "You need to pass a DATABASE_URL into a Pod without baking it into the image. Which rune holds non-secret configuration?"',
    answers: [
      { text: 'Secret', correct: false },
      { text: 'ConfigMap', correct: true },
      { text: 'Volume', correct: false },
      { text: 'Annotation', correct: false },
    ],
    feedbackCorrect:
      '"ConfigMap — the rune-scroll of plain configuration. Secrets carry passwords; ConfigMaps carry everything else."',
    feedbackWrong:
      '"ConfigMap holds non-sensitive key-value configuration. Use Secret for passwords and tokens."',
    xpReward: 20,
  },
  {
    id: 6,
    npcText:
      '"The great hall kubectl," Mimer bellows, "which command reveals ALL Pods in EVERY namespace across the entire cluster?"',
    answers: [
      { text: 'kubectl get pods', correct: false },
      { text: 'kubectl list pods --all', correct: false },
      { text: 'kubectl get pods -A', correct: true },
      { text: 'kubectl describe pods --cluster', correct: false },
    ],
    feedbackCorrect:
      '"kubectl get pods -A — the all-seeing eye! -A means --all-namespaces. No Pod hides from this rune."',
    feedbackWrong:
      '"kubectl get pods -A (or --all-namespaces) shows Pods across every namespace. Without -A you only see the current namespace."',
    xpReward: 20,
  },
];

export default k8sQuestions;
