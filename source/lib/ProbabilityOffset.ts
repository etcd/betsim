import { randomBoolean } from "../utilities/Random";

/**
 * Offsets a given probability by a certain amount of perturbation.
 *
 * Probability is between 0 and 1.
 * Scale is between 0 and 1.
 */
export const offsetProbability = (probability: number, scale: number) => {
  const direction = randomBoolean();
  const perturbation = 1 + Math.random() * scale;

  return probability ** (direction ? perturbation : 1 / perturbation);
};

// attempt #1 (behavior is not symmetric wrt sign of pertubation)
// return probability ** (1 + (Math.random() - 0.5) * scale);

// attempt #2 (idk)
// if (impliedP <= 0.5) return impliedP * randomPerturbation;
// return (-1 * impliedP + 1) * randomPerturbation;

// attempt #3 (scaling doesn't map 0.5 to 0.5)
// const pPlusRandomOffset = probability + (Math.random() - 0.5) * scale;
// const rescaled = (pPlusRandomOffset + scale) / (1 + scale * 2)

// attempt #4 (too biased toward producing crazy inefficiencies close to 0 or 1)
// // add a random offset to the probability
// // this new number ranges from -scale to 1+scale
// const pPlusRandomOffset = probability + (Math.random() - 0.5) * scale;
// // rescale to ensure it remains between 0 and 1
// // startingRange                                      = [-scale, 1 + scale]
// // startingRange - 0.5                                = [-0.5 - scale, 0.5 + scale]
// // (startingRange - 0.5) * 0.5 / (0.5 + scale)        = [-0.5, 0.5]
// // (startingRange - 0.5) * 0.5 / (0.5 + scale) + 0.5  = [0, 1]
// const rescaled = ((pPlusRandomOffset - 0.5) * 0.5) / (0.5 + scale) + 0.5;
// return rescaled;
