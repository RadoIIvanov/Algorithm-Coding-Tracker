let platforms: Array<string>;
let problemDifficulty: Array<string>;
let stageDescriptions: Array<string>;

platforms = [
  "Hacker Rank",
  "Leet Code",
  "CodeChef",
  "Code Wars",
  "Challenge Rocket",
  "Coder Byte",
  "Codin Game",
  "Top Coder",
  "Project Euler",
  "Code Fights",
  "Code Forces",
  "Other platform",
  "Non-algo challenge - project related problem solving"
];

problemDifficulty = ["Easy", "Medium", "Hard", "Other", "Unknown"];

stageDescriptions = [
  "Describe the Problem in 1-2 Sentences (i.e. initial input => ending output)",
  "Generate Base Test Cases",
  "Generate an Idea - Naive(optimize only on second pass)",
  "Write Pseudo Code - Tasks to Pure Functions",
  "Test PC Against Base Test Cases and Revise",
  "Generate And Test Against More Elaborate TC - Revise if Needed",
  "Implement PC",
  "Execute all Tests and Eliminate any Implementation Bugs"
];

export { platforms, problemDifficulty, stageDescriptions };
