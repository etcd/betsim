/** Random integer between min (inclusive) and max (exclusive) */
export const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

/** Random boolean */
export const randomBoolean = () => Math.random() < 0.5;
