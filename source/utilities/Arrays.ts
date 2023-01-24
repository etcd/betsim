/** Creates an array with contents [0, 1, ..., n-1] */
export const range = (n: number) => [...Array(n).keys()];

// TODO: extend this for generic comparables, not just number
/** Gets the min and max of a number array in a single pass */
export const extent = (array: readonly number[]) => {
  if (array.length === 0) return [undefined, undefined] as const;

  return array.reduce(
    (prev, current) => {
      if (prev[1] < current) return [prev[0], current] as const;
      if (current < prev[0]) return [current, prev[1]] as const;
      return prev;
    },
    [array[0]!, array[0]!] as const
  );
};

/** Groups an array of elements by some key of each element. */
export const groupBy = <Element>(
  array: readonly Element[],
  getGroup: (element: Element) => string,
  sortGroupsBy?: (element: Element) => number
) => {
  // the unique groups that elements can be part of
  const uniqueGroups = [...new Set(array.map((element) => getGroup(element)))];

  // the group accumulator used by the reduce below; this is what is returned
  const accumulator: {
    [group: string]: Element[];
  } = Object.fromEntries(uniqueGroups.map((group) => [group, []]));

  // put each element into correct group
  array.map((element) => {
    const group = getGroup(element);
    if (accumulator[group] !== undefined) accumulator[group]?.push(element);
    else accumulator[group] = [element];
  });

  if (sortGroupsBy === undefined) return accumulator;

  return Object.keys(accumulator).map((group) => {
    return [...accumulator[group]!].sort(
      (e1: Element, e2: Element) => sortGroupsBy(e1) - sortGroupsBy(e2)
    );
  });
};

/** Returns a given amount of evenly spaced numbers */
export const evenlySpacedNumbers = (
  /** Desired amount of numbers */
  n: number,
  /** The first output number */
  min: number,
  /** The last output number */
  max: number
): readonly number[] | undefined => {
  if (n < 0) return undefined;
  if (max < min) return undefined;

  const nColorsFloor = Math.floor(n);
  const spacing = (max - min) / nColorsFloor;

  return Array.from({ length: nColorsFloor }, (_, i) => min + i * spacing);
};

/** Type guard for a value being not `null` and not `undefined` */
const _isDefined = <T>(
  value: NonNullable<T> | undefined | null
): value is NonNullable<T> => {
  return value !== null && value !== undefined;
};

/** Type guard for an array with no `undefined` or `null` values */
export const isAllDefined = <T>(
  value: Array<NonNullable<T> | undefined | null>
): value is Array<NonNullable<T>> => {
  return value.every(_isDefined);
};
