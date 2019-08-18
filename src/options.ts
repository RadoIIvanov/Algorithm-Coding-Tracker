let platforms: Array<string>;
let problemDifficulty: Array<string>;
let stageDescriptions: Array<string>;

platforms = [
  "Hacker Rank",
  "Leet Code",
  "CodeChef",
  "Code Wars",  /// non typical difficulty
  "Challenge Rocket",
  "Coder Byte",
  "Codin Game",
  "Top Coder",
  "Code Fights/Code Signal",
  "Code Forces",  /// non typical difficulty
  "SPOJ",
  "Exercism",
  "Other platform",
];

stageDescriptions = [
  "Understand the Problem Thoroughly/Describe it in 1-2 Sentences (i.e. initial input => ending output)",
  "Generate Base Test Cases(keep them simple, yet exhaustive)",
  "Generate an Idea - Naive(optimize only on second pass), and Describe it in 1-2 Sentences",
  "Write Pseudo Code - Tasks to Small Pure Functions",
  "Test PC Against Base Test Cases and Revise",
  "Implement PC, Test, And Fix any Implementation Bugs",
];

export { platforms, problemDifficulty, stageDescriptions };
