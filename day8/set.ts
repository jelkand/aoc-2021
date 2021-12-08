// thanks MDN!

export function isSuperset(set: Set<string>, subset: Set<string>) {
  for (let elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}

export function union(setA: Set<string>, setB: Set<string>) {
  const _union = new Set(setA);
  for (const elem of setB) {
    _union.add(elem);
  }
  return _union;
}

export function intersection(setA: Set<string>, setB: Set<string>) {
  const _intersection = new Set<string>();
  for (const elem of setB) {
    if (setA.has(elem)) {
      _intersection.add(elem);
    }
  }
  return _intersection;
}

export function setEq(setA: Set<string>, setB: Set<string>) {
  return symmetricDifference(setA, setB).size === 0;
}
export function symmetricDifference(setA: Set<string>, setB: Set<string>) {
  const _difference = new Set(setA);
  for (const elem of setB) {
    if (_difference.has(elem)) {
      _difference.delete(elem);
    } else {
      _difference.add(elem);
    }
  }
  return _difference;
}

export function difference(setA: Set<string>, setB: Set<string>) {
  const _difference = new Set(setA);
  for (const elem of setB) {
    _difference.delete(elem);
  }
  return _difference;
}
