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

stageDescriptions = [ /// this should be revised when basicos has covered it (i.e. understand problem 2?)
  "Understand the Problem Thoroughly/Describe it in 1-2 Sentences (i.e. initial input => ending output)",
  "Generate Base Test Cases(keep them simple, yet exhaustive)",
  "Generate an Idea - Naive(optimize only on second pass), and Describe it in 1-2 Sentences",
  "Write Pseudo Code - Tasks to Small Pure Functions",
  "Test PC Against Base Test Cases and Revise",
  "Implement PC, Test, And Fix any Implementation Bugs",
];

/// stage and position affect agility and consistency measure (also dummy data stuff), if too many <=> shortcuts?

export { platforms, problemDifficulty, stageDescriptions };
