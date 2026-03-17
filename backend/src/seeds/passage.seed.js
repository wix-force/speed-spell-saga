const Passage = require('../modules/passage/passage.model');

const passages = [
  // Easy (7)
  { text: 'The quick brown fox jumps over the lazy dog. A wizard\'s job is to vex chumps quickly in fog. How vexingly quick daft zebras jump!', difficulty: 'easy', language: 'English' },
  { text: 'The sun set behind the mountains, casting long shadows across the valley. Birds sang their evening songs as the cool breeze rustled through the leaves.', difficulty: 'easy', language: 'English' },
  { text: 'She sells sea shells by the sea shore. The shells she sells are sea shells for sure. If she sells shells on the seashore then she sells seashore shells.', difficulty: 'easy', language: 'English' },
  { text: 'A warm cup of coffee on a rainy day is all you need to feel cozy. The aroma fills the room and brings comfort to the soul.', difficulty: 'easy', language: 'English' },
  { text: 'The cat sat on the mat and watched the birds fly by. It was a peaceful afternoon in the garden with nothing but gentle winds.', difficulty: 'easy', language: 'English' },
  { text: 'Reading books is a wonderful habit that opens your mind to new ideas. Every page brings a new adventure and every chapter tells a unique story.', difficulty: 'easy', language: 'English' },
  { text: 'Spring brings flowers and sunshine after the cold winter months. Children play in the parks while butterflies dance among the blossoming trees.', difficulty: 'easy', language: 'English' },

  // Medium (7)
  { text: 'Programming is the art of telling another human being what one wants the computer to do. Software is a great combination between artistry and engineering.', difficulty: 'medium', language: 'English' },
  { text: 'React hooks let you use state and other features without writing a class. They embrace functions and avoid the complexity of classes, mixins, and inheritance.', difficulty: 'medium', language: 'English' },
  { text: 'The internet has transformed how we communicate, work, and learn. Information that once took weeks to find is now available in milliseconds at our fingertips.', difficulty: 'medium', language: 'English' },
  { text: 'Machine learning algorithms identify patterns in data to make predictions and decisions. These systems improve through experience without being explicitly programmed for every scenario.', difficulty: 'medium', language: 'English' },
  { text: 'Version control systems track changes to files over time so you can recall specific versions later. Git is the most widely used distributed version control system in software development.', difficulty: 'medium', language: 'English' },
  { text: 'Cloud computing delivers computing services including servers, storage, databases, networking, and analytics over the internet to offer faster innovation and flexible resources.', difficulty: 'medium', language: 'English' },
  { text: 'APIs enable different software applications to communicate with each other. They define the methods and data formats that programs can use to request and exchange information.', difficulty: 'medium', language: 'English' },

  // Hard (7)
  { text: 'In the realm of competitive programming, algorithmic efficiency determines the boundary between accepted and time-limit-exceeded submissions. Understanding asymptotic complexity enables practitioners to evaluate performance characteristics systematically.', difficulty: 'hard', language: 'English' },
  { text: 'Quantum entanglement represents one of the most counterintuitive phenomena in physics, whereby particles become interconnected such that measurements on one instantaneously influence the other regardless of spatial separation.', difficulty: 'hard', language: 'English' },
  { text: 'Distributed systems must contend with the fundamental impossibility result known as the CAP theorem, which states that a distributed data store cannot simultaneously provide more than two of consistency, availability, and partition tolerance.', difficulty: 'hard', language: 'English' },
  { text: 'Cryptographic hash functions are mathematical algorithms that map data of arbitrary size to a bit array of fixed size. They are designed to be one-way functions that are infeasible to invert computationally.', difficulty: 'hard', language: 'English' },
  { text: 'The observer pattern establishes a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically, promoting loose coupling between interacting classes.', difficulty: 'hard', language: 'English' },
  { text: 'Functional programming emphasizes the use of pure functions and immutable data structures, avoiding shared state and mutable data. This paradigm leads to code that is more predictable, testable, and parallelizable.', difficulty: 'hard', language: 'English' },
  { text: 'Microservices architecture decomposes applications into small, independent services that communicate through well-defined APIs. Each service is self-contained, deployable independently, and organized around specific business capabilities.', difficulty: 'hard', language: 'English' },
];

async function seedPassages() {
  const count = await Passage.countDocuments();
  if (count >= 20) {
    console.log(`✓ Passages already seeded (${count} found)`);
    return;
  }

  // Clear existing and re-seed
  await Passage.deleteMany({});
  await Passage.insertMany(passages);
  console.log(`✓ ${passages.length} passages seeded`);
}

module.exports = seedPassages;
