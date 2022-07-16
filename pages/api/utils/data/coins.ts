export interface ICoins {
  cent: number;
  nickel: number;
  dime: number;
  quarter: number;
  half: number;
  dollar: number;
}

export const coins: ICoins = {
  cent: 10,
  nickel: 10,
  dime: 10,
  quarter: 10,
  half: 10,
  dollar: 10,
};

export const coinConverter = {
  dollar: 1,
  half: 0.5,
  quarter: 0.25,
  dime: 0.1,
  nickel: 0.05,
  cent: 0.01,
};
