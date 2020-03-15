let platforms: Array<string>;
let problemDifficulty: Array<string>;
let stageDescriptions: Array<string>;

platforms = [ //// this needs to be sorted alphabetically
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
  "Edabit",
  "Interview Bit", /// non typical difficulty
  "Checkio",
  "Hacker Earth",
  "Other platform",
];

stageDescriptions = [ /// this should be revised when basicos has covered it
  "Describe the Problem in 1-2 sentences (i.e. difference between initial state and ending state)",
  "Generate Base Test Cases(4-5 input-output pairs, keep them simple, yet exhaustive)",
  "Understand the Problem 2 => Split ",
  "Generate an Idea - Naive(optimize only on second pass), and split it into Tasks",
  "Write Pseudo Code - Allocate Tasks to Small Pure Functions",
  "Test PC Against Base Test Cases and Revise",
  "Implement PC, Test, And Fix any Implementation Bugs",
];

export { platforms, problemDifficulty, stageDescriptions };
