import {complexSqrt, eigenValues} from './utils';
import {type ElementBaseType, type AlgebraElement} from './element';
import {pqrMixin} from './pqr';

export * from './element';

// Comparisons using two arguments
export function equals(a: AlgebraElement, b: AlgebraElement): boolean {
  return a.equals(b);
}
export function closeTo(
  a: AlgebraElement,
  b: AlgebraElement,
  tolerance?: number
): boolean {
  return a.closeTo(b, tolerance);
}

// Validation
export function hasNaN(element: AlgebraElement): boolean {
  return element.hasNaN();
}
export function hasInfinity(element: AlgebraElement): boolean {
  return element.hasInfinity();
}
export function isNil(element: AlgebraElement, tolerance?: number): boolean {
  return element.isNil(tolerance);
}
export function isGrade(
  element: AlgebraElement,
  grade: number,
  tolerance?: number
): boolean {
  return element.isGrade(grade, tolerance);
}

// Unary scalar operations using one argument
export function norm(element: AlgebraElement): number {
  return element.norm();
}
export function vnorm(element: AlgebraElement): number {
  return element.vnorm();
}

// Unary operations using one argument
export function neg(element: AlgebraElement): AlgebraElement {
  return element.neg();
}
export function cwAbs(element: AlgebraElement): AlgebraElement {
  return element.cwAbs();
}
export function involute(element: AlgebraElement): AlgebraElement {
  return element.involute();
}
export function rev(element: AlgebraElement): AlgebraElement {
  return element.rev();
}
export function conjugate(element: AlgebraElement): AlgebraElement {
  return element.conjugate();
}
export function inverse(element: AlgebraElement): AlgebraElement {
  return element.inverse();
}
export function normalize(
  element: AlgebraElement,
  newNorm?: number
): AlgebraElement {
  return element.normalize(newNorm);
}
export function exp(
  element: AlgebraElement,
  forceTaylor?: boolean,
  numTaylorTerms?: number
): AlgebraElement {
  return element.exp(forceTaylor, numTaylorTerms);
}
export function clone(element: AlgebraElement) {
  return element.clone();
}
// Dual Zoo
export function dual(element: AlgebraElement): AlgebraElement {
  return element.dual();
}
export function undual(element: AlgebraElement): AlgebraElement {
  return element.undual();
}
export function podge(element: AlgebraElement): AlgebraElement {
  return element.podge();
}
export function unpodge(element: AlgebraElement): AlgebraElement {
  return element.unpodge();
}
// See star overload for forward implementation
export function unstar(element: AlgebraElement): AlgebraElement {
  return element.unstar();
}
export function hodge(element: AlgebraElement): AlgebraElement {
  return element.hodge();
}
export function unhodgel(element: AlgebraElement): AlgebraElement {
  return element.unhodge();
}

// Scalar operations
export function scale(element: AlgebraElement, scalar: number): AlgebraElement {
  return element.scale(scalar);
}
export function pow(element: AlgebraElement, power: number): AlgebraElement {
  return element.pow(power);
}

// Multi-scalar operations
export function applyWeights(
  element: AlgebraElement,
  weights: number[]
): AlgebraElement {
  return element.applyWeights(weights);
}

// Index operations
export function negateGrades(
  element: AlgebraElement,
  ...grades: number[]
): AlgebraElement {
  return element.negateGrades(...grades);
}

// Binary operations using two arguments
export function add(a: AlgebraElement, b: AlgebraElement): AlgebraElement {
  return a.add(b);
}
export function sub(a: AlgebraElement, b: AlgebraElement): AlgebraElement {
  return a.sub(b);
}
export function mul(a: AlgebraElement, b: AlgebraElement): AlgebraElement {
  return a.mul(b);
}
export function div(a: AlgebraElement, b: AlgebraElement): AlgebraElement {
  return a.div(b);
}
export function ldivs(a: AlgebraElement, b: AlgebraElement): AlgebraElement {
  return a.ldivs(b);
}
export function wedge(a: AlgebraElement, b: AlgebraElement): AlgebraElement {
  return a.wedge(b);
}
export function vee(a: AlgebraElement, b: AlgebraElement): AlgebraElement {
  return a.vee(b);
}
// Contractions
export function contract(
  a: AlgebraElement,
  b: AlgebraElement,
  criterion: (r: number, s: number) => number
): AlgebraElement {
  return a.contract(b, criterion);
}
export function dot(a: AlgebraElement, b: AlgebraElement): AlgebraElement {
  return a.dot(b);
}
export function dotL(a: AlgebraElement, b: AlgebraElement): AlgebraElement {
  return a.dotL(b);
}
export function dotR(a: AlgebraElement, b: AlgebraElement): AlgebraElement {
  return a.dotR(b);
}
export function star(element: AlgebraElement): AlgebraElement;
export function star(a: AlgebraElement, b: AlgebraElement): AlgebraElement;
export function star(a: AlgebraElement, b?: AlgebraElement): AlgebraElement {
  if (b === undefined) {
    return a.star();
  }
  return a.star(b);
}

// Subsets
export function even(element: AlgebraElement): AlgebraElement {
  return element.even();
}
export function grade(element: AlgebraElement, grade: number): AlgebraElement {
  return element.grade(grade);
}

// https://stackoverflow.com/a/43122214
function bitCount(n: number) {
  n = n - ((n >> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
  return (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
}

// https://en.wikipedia.org/wiki/Gnome_sort
function sortSign(sequence: number[]) {
  let sign = 1;
  let pos = 0;
  while (pos < sequence.length) {
    if (pos === 0 || sequence[pos] >= sequence[pos - 1]) {
      pos++;
    } else {
      const temp = sequence[pos];
      sequence[pos] = sequence[pos - 1];
      sequence[pos - 1] = temp;
      sign = -sign;
      pos--;
    }
  }
  return sign;
}

// Contraction criteria
function symmetric(r: number, s: number) {
  return Math.abs(r - s);
}

function left(r: number, s: number) {
  return s - r;
}

function right(r: number, s: number) {
  return r - s;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function nil(r: number, s: number) {
  return 0;
}

function reduceIndices(indices: number[]) {
  return indices.map(i => 1 << i).reduce((a, b) => a ^ b, 0);
}

const MAX_DIMENSIONS = 36;

export default function Algebra(
  p: number,
  q = 0,
  r = 0,
  baseType: typeof ElementBaseType = Float32Array,
  unroll = true
): typeof AlgebraElement {
  const metric: number[] = [];
  for (let i = 0; i < r; ++i) {
    metric.push(0);
  }
  for (let i = 0; i < p; ++i) {
    metric.push(1);
  }
  for (let i = 0; i < q; ++i) {
    metric.push(-1);
  }
  const dimensions = p + q + r;
  const size = 1 << dimensions;
  const indexMask = size - 1;

  if (dimensions > MAX_DIMENSIONS) {
    throw new Error(`Maximum total number of dimensions is ${MAX_DIMENSIONS}`);
  }

  // Geometric product between basis vectors
  function basisIndexMul(...indices: number[]) {
    // sign incorporates Ex * Ey metric
    const sign = sortSign(indices);
    // weight incorporates Ex * Ex metric
    let weight = 1;
    let i = 1;
    while (i < indices.length) {
      if (indices[i] === indices[i - 1]) {
        weight *= metric[indices.splice(i, 1)[0]];
      } else {
        i++;
      }
    }
    return sign * weight;
  }

  // Geometric product between bundles of basis vectors using bit field indices
  function basisMul(...bitFieldIndices: number[]) {
    const indices: number[] = [];

    bitFieldIndices.forEach(bitFieldIndex => {
      for (let i = 0; i < dimensions; ++i) {
        const p = 1 << i;
        if (p & bitFieldIndex) {
          indices.push(i);
        }
      }
    });
    return basisIndexMul(...indices);
  }

  // This could be turned into a bit array if memory becomes an issue
  const mulTable: number[][] = [];
  for (let i = 0; i < size; ++i) {
    const row: number[] = [];
    for (let j = 0; j < size; ++j) {
      row.push(basisMul(i, j));
    }
    mulTable.push(row);
  }

  // Mapping from bit-field indices to ganja.js lexicographic order
  const indexString: [number, string][] = [];
  for (let i = 0; i < size; ++i) {
    let str = '';
    for (let j = 0; j < dimensions; ++j) {
      if (i & (1 << j)) {
        str += j.toString(MAX_DIMENSIONS);
      }
    }
    indexString.push([i, str]);
  }
  function cmp(a: [any, string], b: [any, string]) {
    if (a[1].length < b[1].length) {
      return -1;
    }
    if (a[1].length > b[1].length) {
      return 1;
    }
    if (a[1] < b[1]) {
      return -1;
    }
    if (a[1] > b[1]) {
      return 1;
    }
    return 0;
  }
  indexString.sort(cmp);

  class AlgebraClass extends baseType {
    constructor(values?: Iterable<number>) {
      if (values === undefined) {
        super(size);
      } else {
        super(values);
      }
    }

    cls() {
      return AlgebraClass;
    }

    empty() {
      return new (this.cls())();
    }

    zeroed() {
      return this.cls().zero();
    }

    equals(other: AlgebraElement) {
      for (let i = 0; i < this.length; ++i) {
        if (this[i] !== other[i]) {
          return false;
        }
      }
      return true;
    }

    closeTo(other: AlgebraElement, tolerance = 1e-4) {
      for (let i = 0; i < this.length; ++i) {
        const error = Math.abs(this[i] - other[i]);
        if (error > tolerance || isNaN(error)) {
          return false;
        }
      }
      return true;
    }

    hasNaN() {
      for (let i = 0; i < this.length; ++i) {
        if (isNaN(this[i])) {
          return true;
        }
      }
      return false;
    }

    hasInfinity() {
      for (let i = 0; i < this.length; ++i) {
        if (Math.abs(this[i]) === Infinity) {
          return true;
        }
      }
      return false;
    }

    isNil(tolerance = 0) {
      for (let i = 0; i < this.length; ++i) {
        if (Math.abs(this[i]) > tolerance) {
          return false;
        }
      }
      return true;
    }

    isGrade(grade: number, tolerance = 0) {
      for (let i = 0; i < this.length; ++i) {
        if (bitCount(i) !== grade && Math.abs(this[i]) > tolerance) {
          return false;
        }
      }
      return true;
    }

    norm() {
      return Math.sqrt(Math.abs(this.mul(this.conjugate()).s));
    }

    vnorm() {
      let result = 0;
      for (let i = 0; i < this.length; ++i) {
        result += this[i] * this[i];
      }
      return Math.sqrt(result);
    }

    neg(): AlgebraElement {
      const result = this.empty();
      for (let i = 0; i < this.length; ++i) {
        result[i] = -this[i];
      }
      return result;
    }

    cwAbs(): AlgebraElement {
      const result = this.empty();
      for (let i = 0; i < this.length; ++i) {
        result[i] = Math.abs(this[i]);
      }
      return result;
    }

    rev(): AlgebraElement {
      const result = this.empty();
      for (let i = 0; i < this.length; ++i) {
        result[i] = bitCount(i) & 2 ? -this[i] : this[i];
      }
      return result;
    }

    involute(): AlgebraElement {
      const result = this.empty();
      for (let i = 0; i < this.length; ++i) {
        result[i] = bitCount(i) & 1 ? -this[i] : this[i];
      }
      return result;
    }

    conjugate(): AlgebraElement {
      const result = this.empty();
      for (let i = 0; i < this.length; ++i) {
        result[i] = (bitCount(i) + 1) & 2 ? -this[i] : this[i];
      }
      return result;
    }

    // === Dual Zoo ===

    // For all Ex = AlgebraClass.basisVector(...x)
    // Ex.mul(Ex.dual()) === AlgebraClass.pseudoscalar()
    dual(): AlgebraElement {
      const result = this.empty();
      for (let i = 0; i < this.length; ++i) {
        const dualIndex = indexMask ^ i;
        result[dualIndex] = this[i] * mulTable[i][dualIndex];
      }
      return result;
    }
    // a.vee(b) === undual(b.dual().wedge(a.dual()))
    undual(): AlgebraElement {
      const result = this.empty();
      for (let i = 0; i < this.length; ++i) {
        const dualIndex = indexMask ^ i;
        result[dualIndex] = this[i] * mulTable[dualIndex][i];
      }
      return result;
    }

    podge(): AlgebraElement {
      const result = this.empty();
      for (let i = 0; i < this.length; ++i) {
        result[indexMask ^ i] = this[i] * mulTable[i][indexMask];
      }
      return result;
    }
    unpodge(): AlgebraElement {
      const result = this.empty();
      for (let i = 0; i < this.length; ++i) {
        result[indexMask ^ i] = this[i] / mulTable[indexMask ^ i][indexMask];
      }
      return result;
    }

    // See star() overload for forward implementation
    unstar(): AlgebraElement {
      const result = this.empty();
      for (let i = 0; i < this.length; ++i) {
        result[indexMask ^ i] =
          this[i] * (mulTable[indexMask ^ i][indexMask] || 1);
      }
      return result;
    }

    hodge(): AlgebraElement {
      const result = this.empty();
      for (let i = 0; i < this.length; ++i) {
        const dualIndex = indexMask ^ i;
        result[dualIndex] =
          this[i] * (mulTable[i][indexMask] || mulTable[i][dualIndex]);
      }
      return result;
    }
    unhodge(): AlgebraElement {
      const result = this.empty();
      for (let i = 0; i < this.length; ++i) {
        const dualIndex = indexMask ^ i;
        result[dualIndex] =
          this[i] * (mulTable[dualIndex][indexMask] || mulTable[dualIndex][i]);
      }
      return result;
    }

    normalize(newNorm = 1): AlgebraElement {
      return this.scale(newNorm / this.norm());
    }

    rotorNormalize(): AlgebraElement {
      throw new Error('Do not know how to normalize a rotor in this algebra');
    }

    // TODO: Move to pqr.ts
    sqrt(forceBabylon = false, numIter = 16): AlgebraElement {
      if (!forceBabylon) {
        if (p === 0 && q === 2 && r === 0) {
          const result = this.clone();
          result.s = 0;
          const imagNorm = result.vnorm();
          const [x, y] = complexSqrt(this.s, imagNorm);
          if (imagNorm < 1e-5) {
            result.rescale(0.5);
          } else {
            result.rescale(y / imagNorm);
          }
          result.s = x;
          return result;
        }
      }
      // Not quaranteed to converge. Barely better than nothing.
      // https://en.wikipedia.org/wiki/Methods_of_computing_square_roots#Babylonian_method
      const root = this.clone();
      root.s += 1;
      for (let i = 1; i < numIter; ++i) {
        root.accumulate(this.div(root)).rescale(0.5);
      }
      return root;
    }

    rotorSqrt(): AlgebraElement {
      const root = this.clone();
      root.s += 1;
      return root.rotorNormalize();
    }

    // TODO: Move to pqr.ts
    exp(forceTaylor = false, numTaylorTerms = 32): AlgebraElement {
      if (!forceTaylor) {
        if (p === 0 && q === 2 && r === 0) {
          const expS = Math.exp(this.s);
          const result = this.clone();
          result.s = 0;
          const imagNorm = result.vnorm();
          if (imagNorm < 1e-5) {
            result.rescale(expS);
          } else {
            result.rescale((expS * Math.sin(imagNorm)) / imagNorm);
          }
          result.s = expS * Math.cos(imagNorm);
          return result;
        }
      }
      if (!forceTaylor) {
        // Closed form exp
        const grade2 = this.clone();
        grade2.s = 0;
        if (grade2.isGrade(2)) {
          return grade2.split().reduce((total, simple) => {
            const square = simple.square().s;
            const len = Math.sqrt(Math.abs(square));
            if (len <= 1e-5) {
              simple.s += 1;
            } else if (square < 0) {
              simple = simple.scale(Math.sin(len) / len);
              simple.s += Math.cos(len);
            } else {
              simple = simple.scale(Math.sinh(len) / len);
              simple.s += Math.cosh(len);
            }
            return total.mul(simple);
          }, this.cls().scalar(Math.exp(this.s)));
        }
      }

      // Taylor series
      const result = this.cls().scalar();
      let term = this.cls().scalar();
      for (let i = 1; i < numTaylorTerms; ++i) {
        term = term.mul(this.scale(1 / i));
        result.accumulate(term);
      }
      return result;
    }

    bivectorExp() {
      return this.exp();
    }

    // TODO: Move to pqr.ts
    log(): AlgebraElement {
      if (p === 0 && q === 2 && r === 0) {
        const norm = this.vnorm();
        const imag = this.clone();
        imag.s = 0;
        const imagNorm = imag.vnorm();
        const result = imag.scale(Math.acos(this.s / norm) / imagNorm);
        result.s = Math.log(norm);
        return result;
      }

      const sum = this.zeroed();
      this.factorize().forEach(bi => {
        const [ci, si] = [bi.s, bi.grade(2)];
        const square = si.square().s;
        const len = Math.sqrt(Math.abs(square));
        if (Math.abs(square) < 1e-5) sum.accumulate(si);
        if (square < 0) sum.accumulate(si.scale(Math.acos(ci) / len));
        sum.accumulate(si.scale(Math.acosh(ci) / len));
      });
      return sum;
    }

    rotorLog() {
      return this.log();
    }

    clone(): AlgebraElement {
      return new (this.cls())(this);
    }

    negateGrades(...grades: number[]): AlgebraElement {
      const result = this.empty();
      for (let i = 0; i < this.length; ++i) {
        result[i] = grades.includes(bitCount(i)) ? -this[i] : this[i];
      }
      return result;
    }

    inverse(): AlgebraElement {
      // Matrix-free inverses up to 5D
      // http://repository.essex.ac.uk/17282/1/TechReport_CES-534.pdf
      switch (dimensions) {
        // cases 0 and 1 completely covered by pqr.ts
        case 2:
          const conjugate = this.conjugate();
          return conjugate.scale(1 / this.mul(conjugate).s);
        case 3:
          const reverse = this.rev();
          const involute3 = this.involute();
          const conjugate3 = this.conjugate();
          return reverse
            .mul(involute3)
            .mul(conjugate3)
            .scale(1 / this.mul(conjugate3).mul(involute3).mul(reverse).s);
        case 4:
          const modulus = this.mul(this.conjugate());
          const n34 = modulus.negateGrades(3, 4);
          return this.conjugate()
            .mul(n34)
            .scale(1 / modulus.mul(n34).s);
        case 5:
          const civ = this.conjugate().mul(this.involute()).mul(this.rev());
          const tciv = this.mul(civ);
          const tciv14 = tciv.negateGrades(1, 4);
          return civ.mul(tciv14).scale(1 / tciv.mul(tciv14).s);
        default:
          // Shirokov inverse
          const N = 1 << (((dimensions + 1) / 2) | 0);
          let Uk = this.scale(1);
          let adjU: AlgebraElement;
          for (let k = 1; k < N; ++k) {
            adjU = Uk.clone();
            adjU.s -= (N / k) * Uk.s;
            Uk = this.mul(adjU);
          }
          return Uk.s === 0 ? this.zeroed() : adjU!.scale(1 / Uk.s);
      }
    }

    square(): AlgebraElement {
      return this.mul(this);
    }

    scale(scalar: number): AlgebraElement {
      return this.clone().rescale(scalar);
    }

    rescale(scalar: number): AlgebraElement {
      for (let i = 0; i < this.length; ++i) {
        this[i] *= scalar;
      }
      return this;
    }

    pow(power: number, splitStages = 8): AlgebraElement {
      if (power !== Math.round(power)) {
        if (dimensions === 0) {
          return this.cls().scalar(Math.pow(this.s, power));
        } else if (dimensions === 1) {
          return this.log().scale(power).exp();
        } else if (dimensions === 2) {
          if (q === 2) {
            return this.log().scale(power).exp();
          }
        }
        let epsilon = this.sqrt();
        power *= 2;
        let stages = splitStages;
        while (stages > 0 && power !== Math.round(power)) {
          epsilon = epsilon.sqrt();
          power *= 2;
          stages--;
        }
        return epsilon.pow(power);
      }
      if (power === 0) {
        return this.cls().scalar();
      }
      if (power === 1) {
        return this.clone();
      }
      if (power === 2) {
        return this.square();
      }
      if (power > 0) {
        let result = this.cls().scalar();
        let powerOfTwo = this.clone();
        while (power) {
          if (power & 1) {
            result = result.mul(powerOfTwo);
          }
          powerOfTwo = powerOfTwo.square();
          power >>= 1;
        }
        return result;
      }
      return this.inverse().pow(-power);
    }

    applyWeights(weights: number[]) {
      const result = this.clone();
      for (let i = 0; i < this.length; ++i) {
        for (let j = 0; j < weights.length; ++j) {
          if (i & (1 << j)) {
            result[i] *= weights[j];
          }
        }
      }
      return result;
    }

    add(other: AlgebraElement): AlgebraElement {
      const result = this.empty();
      for (let i = 0; i < this.length; ++i) {
        result[i] = this[i] + other[i];
      }
      return result;
    }

    sub(other: AlgebraElement): AlgebraElement {
      const result = this.empty();
      for (let i = 0; i < this.length; ++i) {
        result[i] = this[i] - other[i];
      }
      return result;
    }

    mul(other: AlgebraElement): AlgebraElement {
      const result = this.zeroed();
      for (let i = 0; i < this.length; ++i) {
        if (!this[i]) {
          continue;
        }
        for (let j = 0; j < other.length; ++j) {
          result[i ^ j] += this[i] * other[j] * mulTable[i][j];
        }
      }
      return result;
    }

    rmul(other: AlgebraElement): AlgebraElement {
      const result = this.zeroed();
      for (let i = 0; i < this.length; ++i) {
        if (!this[i]) {
          continue;
        }
        for (let j = 0; j < other.length; ++j) {
          result[i ^ j] += this[i] * other[j] * mulTable[j][i];
        }
      }
      return result;
    }

    div(other: AlgebraElement): AlgebraElement {
      return this.mul(other.inverse());
    }

    ldiv(other: AlgebraElement): AlgebraElement {
      return other.inverse().mul(this);
    }

    ldivs(other: AlgebraElement): AlgebraElement {
      return this.inverse().mul(other);
    }

    wedge(other: AlgebraElement): AlgebraElement {
      const result = this.zeroed();
      for (let i = 0; i < this.length; ++i) {
        if (!this[i]) {
          continue;
        }
        for (let j = 0; j < other.length; ++j) {
          if (!(i & j)) {
            result[i ^ j] += this[i] * other[j] * mulTable[i][j];
          }
        }
      }
      return result;
    }

    rwedge(other: AlgebraElement): AlgebraElement {
      const result = this.zeroed();
      for (let i = 0; i < this.length; ++i) {
        if (!this[i]) {
          continue;
        }
        for (let j = 0; j < other.length; ++j) {
          if (!(i & j)) {
            result[i ^ j] += this[i] * other[j] * mulTable[j][i];
          }
        }
      }
      return result;
    }

    vee(other: AlgebraElement): AlgebraElement {
      return other.dual().wedge(this.dual()).undual();
    }

    rvee(other: AlgebraElement): AlgebraElement {
      return other.dual().rwedge(this.dual()).undual();
    }

    rotorMean(other: AlgebraElement) {
      return this.add(other).rotorNormalize();
    }

    contract(
      other: AlgebraElement,
      criterion: (r: number, s: number) => number
    ): AlgebraElement {
      const result = this.zeroed();
      for (let i = 0; i < this.length; ++i) {
        if (!this[i]) {
          continue;
        }
        const gradeI = bitCount(i);
        for (let j = 0; j < other.length; ++j) {
          const gradeJ = bitCount(j);
          const target = i ^ j;
          const gradeTarget = bitCount(target);
          if (gradeTarget === criterion(gradeI, gradeJ)) {
            result[target] += this[i] * other[j] * mulTable[i][j];
          }
        }
      }
      return result;
    }

    dot(other: AlgebraElement) {
      return this.contract(other, symmetric);
    }

    dotL(other: AlgebraElement) {
      return this.contract(other, left);
    }

    dotR(other: AlgebraElement) {
      return this.contract(other, right);
    }

    star(maybeOther?: AlgebraElement) {
      if (maybeOther === undefined) {
        const result = this.empty();
        for (let i = 0; i < this.length; ++i) {
          result[indexMask ^ i] = this[i] * (mulTable[i][indexMask] || 1);
        }
        return result;
      }
      return this.contract(maybeOther, nil);
    }

    // Scalar part
    get s(): number {
      return this[0];
    }
    set s(value: number) {
      this[0] = value;
    }

    // Pseudoscalar part
    get ps(): number {
      return this[this.length - 1];
    }
    set ps(value: number) {
      this[this.length - 1] = value;
    }

    getAt(...indices: number[]): number {
      return this[reduceIndices(indices)] * basisIndexMul(...indices);
    }

    setAt(...indicesAndValue: number[]): this {
      const indices = indicesAndValue.slice(0, -1);
      const value = indicesAndValue[indicesAndValue.length - 1];
      this[reduceIndices(indices)] = value / basisIndexMul(...indices);
      return this;
    }

    even() {
      const result = this.zeroed();
      for (let i = 0; i < this.length; ++i) {
        if (!(bitCount(i) & 1)) {
          result[i] = this[i];
        }
      }
      return result;
    }

    grade(grade: number) {
      const result = this.zeroed();
      for (let i = 0; i < this.length; ++i) {
        if (bitCount(i) === grade) {
          result[i] = this[i];
        }
      }
      return result;
    }

    vector(grade = 1) {
      const result = [];
      for (let i = 0; i < this.length; ++i) {
        if (indexString[i][1].length === grade) {
          result.push(this[indexString[i][0]]);
        }
      }
      return new baseType(result);
    }

    rotor() {
      const result = [];
      for (let i = 0; i < this.length; ++i) {
        if (indexString[i][1].length % 2 === 0) {
          result.push(this[indexString[i][0]]);
        }
      }
      return new baseType(result);
    }

    // Ganja.js compatible representation
    ganja() {
      return new baseType(indexString.map(g => this[g[0]]));
    }

    accumulate(other: AlgebraElement) {
      for (let i = 0; i < this.length; ++i) {
        this[i] += other[i];
      }
      return this;
    }

    // Bivector split - we handle all real cases, still have to add the complex cases for those exception scenarios.
    split(iter = 50) {
      const TWT = this.wedge(this);
      if (TWT.vnorm() < 1e-5) return [this.clone()]; // bivector was simple.
      const k = Math.floor(dimensions / 2);
      let B = this.clone();
      let m = 1;
      let Wi: AlgebraElement[] = [];
      for (let i = 0; i < k; ++i) {
        m = m * (i + 1);
        Wi.push(B.scale(1 / m));
        B = B.wedge(this);
      }
      let eigen;
      if (k < 3) {
        // The quadratic case is easy to solve. (for spaces <6D)
        const TDT = this.dot(this).s;
        const D = 0.5 * Math.sqrt(TDT * TDT - TWT.square().s);
        eigen = [0.5 * TDT + D, 0.5 * TDT - D].sort(
          (a, b) => Math.abs(a) - Math.abs(b)
        );
      } else {
        // For >6D, closed form solutions of the characteristic polyn. are impossible, use eigenvalues of companion matrix.
        const Wis = Wi.map((W, i) => W.square().s * (-1) ** (k - i + (k % 2)));
        const matrix: number[][] = [];
        for (let i = 0; i < k; ++i) {
          const row: number[] = [];
          for (let j = 0; j < k; ++j) {
            if (j === k - 1) {
              row.push(Wis[k - i - 1]);
            } else if (i - 1 === j) {
              row.push(1);
            } else {
              row.push(0);
            }
          }
          matrix.push(row);
        }
        eigen = eigenValues(matrix, iter).sort(
          (a, b) => Math.abs(a) - Math.abs(b)
        );
      }
      Wi = [this.cls().scalar(), ...Wi, this.zeroed()];
      const sum = this.zeroed();
      const k2 = Math.floor(k / 2);
      const res: AlgebraElement[] = eigen.slice(1).map(v => {
        const N = this.zeroed();
        const DN = this.zeroed();
        for (let i = 0; i <= k2; ++i) {
          N.accumulate(Wi[2 * i + 1].scale(v ** (k2 - i)));
          DN.accumulate(Wi[2 * i].scale(v ** (k2 - i)));
        }
        if (DN.vnorm() === 0) return this.zeroed();
        const ret = N.div(DN);
        sum.accumulate(ret);
        return ret;
      });
      return [this.sub(sum), ...res]; // Smallest eigvalue becomes B-rest
    }

    // Factorize a motor
    factorize(iter = 50) {
      const S = this.grade(2).split(iter);
      const R = S.slice(0, S.length - 1).map(Mi => {
        Mi.s += this.s;
        const scale = Math.sqrt(Mi.rev().mul(Mi).s);
        return Mi.scale(1 / scale);
      });
      R.push(
        R.reduce((tot, fact) => tot.mul(fact.rev()), this.cls().scalar()).mul(
          this
        )
      );
      return R;
    }

    static zero(): AlgebraElement {
      return new AlgebraClass().fill(0);
    }

    static scalar(magnitude = 1): AlgebraElement {
      const result = AlgebraClass.zero();
      result[0] = magnitude;
      return result;
    }

    static pseudoscalar(magnitude = 1): AlgebraElement {
      const result = AlgebraClass.zero();
      result[size - 1] = magnitude;
      return result;
    }

    static basisVector(...indices: number[]): AlgebraElement {
      const result = AlgebraClass.zero();
      result[reduceIndices(indices)] = 1 / basisIndexMul(...indices);
      return result;
    }

    static fromVector(values: Iterable<number>, grade = 1) {
      const result = AlgebraClass.zero();
      let i = 0;
      for (const component of values) {
        while (i < size) {
          if (indexString[i][1].length === grade) {
            result[indexString[i][0]] = component;
            i++;
            break;
          }
          i++;
        }
      }
      return result;
    }

    static fromRotor(values: Iterable<number>) {
      const result = AlgebraClass.zero();
      let i = 0;
      for (const component of values) {
        while (i < size) {
          if (indexString[i][1].length % 2 === 0) {
            result[indexString[i][0]] = component;
            i++;
            break;
          }
          i++;
        }
      }
      return result;
    }

    static fromGanja(values: Iterable<number>) {
      const result = new AlgebraClass();
      let index = 0;
      for (const component of values) {
        result[indexString[index++][0]] = component;
      }
      return result;
    }

    static get size() {
      return size;
    }

    static get dimensions() {
      return dimensions;
    }
  }

  const Result = pqrMixin(p, q, r, AlgebraClass);

  if (!unroll) {
    return Result;
  }

  // === Replace generic code with optimized unrolled versions ===

  let addInner = '';
  let subInner = '';
  for (let i = 0; i < size; ++i) {
    addInner += `res[${i}]=t[${i}]+o[${i}];`;
    subInner += `res[${i}]=t[${i}]-o[${i}];`;
  }

  const mulLines: string[] = [];
  for (let i = 0; i < size; ++i) {
    mulLines.push(`res[${i}]=`);
  }
  const wedgeLines = [...mulLines];
  const veeLines = [...mulLines];
  const dotLines = [...mulLines];
  const dotLeftLines = [...mulLines];

  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      if (mulTable[i][j] > 0) {
        mulLines[i ^ j] += `+t[${i}]*o[${j}]`;
        if (!(i & j)) {
          wedgeLines[i ^ j] += `+t[${i}]*o[${j}]`;
          veeLines[indexMask ^ i ^ j] += `+t[${indexMask ^ i}]*o[${
            indexMask ^ j
          }]`;
        }
      } else if (mulTable[i][j] < 0) {
        mulLines[i ^ j] += `-t[${i}]*o[${j}]`;
        if (!(i & j)) {
          wedgeLines[i ^ j] += `-t[${i}]*o[${j}]`;
          veeLines[indexMask ^ i ^ j] += `-t[${indexMask ^ i}]*o[${
            indexMask ^ j
          }]`;
        }
      }
    }
  }

  for (let i = 0; i < size; ++i) {
    const gradeI = bitCount(i);
    for (let j = 0; j < size; ++j) {
      const gradeJ = bitCount(j);
      const target = i ^ j;
      const gradeTarget = bitCount(target);
      if (mulTable[i][j] > 0) {
        if (gradeTarget === symmetric(gradeI, gradeJ)) {
          dotLines[target] += `+t[${i}]*o[${j}]`;
        }
        if (gradeTarget === left(gradeI, gradeJ)) {
          dotLeftLines[target] += `+t[${i}]*o[${j}]`;
        }
      } else if (mulTable[i][j] < 0) {
        if (gradeTarget === symmetric(gradeI, gradeJ)) {
          dotLines[target] += `-t[${i}]*o[${j}]`;
        }
        if (gradeTarget === left(gradeI, gradeJ)) {
          dotLeftLines[target] += `-t[${i}]*o[${j}]`;
        }
      }
    }
  }

  const squareTerms: Map<string, number>[] = [];
  for (let i = 0; i < size; ++i) {
    squareTerms.push(new Map());
  }

  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      const terms = squareTerms[i ^ j];
      const key = i < j ? `t[${i}]*t[${j}]` : `t[${j}]*t[${i}]`;
      if (terms.has(key)) {
        terms.set(key, terms.get(key)! + mulTable[i][j]);
      } else {
        terms.set(key, mulTable[i][j]);
      }
    }
  }
  const squareLines: string[] = [];
  for (let i = 0; i < size; ++i) {
    let ones = '';
    let twos = '';
    for (const [key, value] of squareTerms[i].entries()) {
      switch (value) {
        case 0:
          break;
        case 1:
          ones += '+' + key;
          break;
        case -1:
          ones += '-' + key;
          break;
        case 2:
          twos += '+' + key;
          break;
        case -2:
          twos += '-' + key;
          break;
        default:
          throw new Error('Inconsistent squaring table');
      }
    }
    let line = `res[${i}]=`;
    if (twos.length) {
      if (ones.length) {
        line += `${ones}+2*(${twos})`;
      } else {
        line += `2*(${twos})`;
      }
      squareLines.push(line);
    } else if (ones.length) {
      squareLines.push(line + ones);
    }
  }

  type binaryOp = (other: AlgebraElement) => AlgebraElement;
  const prelude = 'const res=new this.constructor();\nconst t=this;\n';
  const finale = '\nreturn res;';
  Result.prototype.add = new Function(
    'o',
    prelude + addInner + finale
  ) as binaryOp;
  Result.prototype.sub = new Function(
    'o',
    prelude + subInner + finale
  ) as binaryOp;
  Result.prototype.mul = new Function(
    'o',
    prelude + mulLines.join('\n') + finale
  ) as binaryOp;
  Result.prototype.wedge = new Function(
    'o',
    prelude + wedgeLines.join('\n') + finale
  ) as binaryOp;
  Result.prototype.vee = new Function(
    'o',
    prelude + veeLines.join('\n') + finale
  ) as binaryOp;
  Result.prototype.dot = new Function(
    'o',
    prelude + dotLines.join('\n') + finale
  ) as binaryOp;
  Result.prototype.dotL = new Function(
    'o',
    prelude + dotLeftLines.join('\n') + finale
  ) as binaryOp;

  Result.prototype.square = new Function(
    '',
    prelude + squareLines.join('\n') + finale
  ) as () => AlgebraElement;

  // We lose the option to negotiate numeric precision but gain speed
  Result.prototype.rmul = function (other: AlgebraElement) {
    return other.mul(this);
  };
  Result.prototype.rwedge = function (other: AlgebraElement) {
    return other.wedge(this);
  };
  Result.prototype.rvee = function (other: AlgebraElement) {
    return other.vee(this);
  };

  return Result;
}
