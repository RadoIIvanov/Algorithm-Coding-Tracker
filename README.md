## Motivation

The aim of the extension is to alleviate certain issues I was encountering during the process of solving algorithmic challenges. Being relatively new to programming, I felt I didn't approach the challenges patiently and metodically enough. This often resulted in i.e. 1. more silly bugs, 2. wasting a lot of time pursuing a particular approach/path without progress (i.e. getting stuck), 3. starting with the coding implementation prematurely 4. trying to optimize before solving the problem in a more obvious/"naive" way first etc.

## What the extension offers currently:

1. It keeps track and records the time you spent on each of the typical stages in the process of solving algorithmic challenges
   a) at the end of a session it asks you for some additional information with regards to the problem and saves the data in a json file (i.e. to be analyzed at a future date)
2. Simple and lightweight - no dependencies

## What are the plans for future versions:

Include a local server that will show you an analysis of the coding data i.e. showing you key metrics and providing insights on where you might want to improve.

## Some decisions that I made judgements on (i.e. open to feedback)

1. Contributed only two commands - To avoid "poluting" the command palette too much, I exposed only the two "main" commands 1. initiate Timer and 2. stop Timer. To futher interact with the extension, you can press the respective statusBarButtons in the bottom right of VSCode (i.e. move on to a new stage/return to a previous stage etc.)
2. Typically, coding challenges from interviews/contests have somekind of implicit/explicit time constraint, which, if you fail to meet, will negatively impact your evaluation. So, I considered including a timer countdown - standard 30-min or something else based on user input), but I decided against it because I thought that 1. problems and 2. programmer skills both vary and interact too much to warrant the use of such an inflexible feature that will likely just distract the programmer throughout a coding session. Ultimately, the idea is the programmer to receive feedback from the analysis of the data file (i.e. showing an increase in avg speed across time should be more important than meeting a rather arbitrary fixed constraint).
3. The default location of the data file is in the **HOME folder of the current user** (i.e. I wanted a safe placed that is changed infrequently). You can change it by modifying the **pathToDatabaseFile.ts** file. Depending on feedback, I might add it as a configurable option.
4. Based on personal experience on where most problems arise (i.e. getting stuck), I've set up an event for the stages in which you test your pseudo code. The event will trigger if you reach the 10min mark in either of the testing stages (i.e. I thought 10 min is a reasonable limit after which you should start considering returning back to a previous stage). Depending on feedback, this might be altered and included as a configurable option.
5. I've made assumptions with respect to 1. coding platforms, 2. problem difficulty, 3. coding stages in the process of solving algorithmic challenges. If you frequently notice that these aren't applicable/informative in your case, feel free to let me know. Additionally, you can customize the extension yourself by changing the hardcoded data in the **options.ts** file.
