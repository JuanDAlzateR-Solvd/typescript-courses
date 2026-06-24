function one(p1: string, p2: number): string {
  return `function declaration ${p1} ${p2}`;
}

const two: (string, number) => string = function two(p1: string, p2: number): string {
  return `function expression ${p1} ${p2}`;
}

const three: (string, number) => string = (p1: string, p2: number): string => {
  return `arrow function ${p1} ${p2}`
}