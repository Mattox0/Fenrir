export enum HangmanStatus {
  status_0 = `   ,==========Y===
   ||  /       
   || /        
   ||
   ||
   ||
  /||
 //||
============`,
  status_1 = `   ,==========Y===
   ||  /      |
   || /       |
   ||/
   ||
   ||
  /||
 //||
============`,
  status_2 = `   ,==========Y===
   ||  /      |
   || /       |
   ||/        O
   ||
   ||
  /||
 //||
============`,
  status_3 = `   ,==========Y===
   ||  /      |
   || /       |
   ||/        O
   ||         |
   ||
  /||
 //||
============`,
  status_4 = `   ,==========Y===
   ||  /      |
   || /       |
   ||/        O
   ||        /|
   ||
  /||
 //||
============`,
  status_5 = `   ,==========Y===
   ||  /      |
   || /       |
   ||/        O
   ||        /|\\
   ||
  /||
 //||
============`,
  status_6 = `   ,==========Y===
   ||  /      |
   || /       |
   ||/        O
   ||        /|\\
   ||        /
  /||
  //||
============`,
  status_7 = `   ,==========Y===
   ||  /      |
   || /       |
   ||/        O
   ||        /|\\
   ||        / \\
  /||
 //||
============`,
}

export type HangmanStatusKey = keyof typeof HangmanStatus;

export function getHangmanStatus(statusKey: HangmanStatusKey): string {
  return HangmanStatus[statusKey];
}