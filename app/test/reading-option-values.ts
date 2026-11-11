// These legacy controls displayed option text but their existing keys require
// letters. Keep other tests' established answer formats unchanged.
const letterQuestions: Record<number, readonly number[]> = {
  11: [33, 34, 35],
  14: [13, 25, 26],
  15: [18, 19, 20, 21, 22, 37, 38, 39, 40],
  16: [12, 13, 14],
  17: [14, 15, 16, 17, 18, 24, 25, 26, 36, 37, 38, 39, 40],
  21: [26, 27, 28, 39, 40],
  22: [28, 29, 30, 31],
  23: [22, 23, 24, 25, 26],
  24: [21, 22, 23],
  27: [21, 22, 23, 24, 25, 26, 40],
  30: [8, 9, 10, 11, 12, 13, 35, 36],
  33: [1, 2, 3, 4, 5, 6, 7, 26, 27, 34, 35, 36],
  36: [1, 2, 3, 24, 25, 26, 27],
  39: [15, 16, 17, 18, 19, 20, 21],
};

export function readingOptionValue(test: number, number: number, text: string, index: number) {
  return letterQuestions[test]?.includes(number) ? String.fromCharCode(65 + index) : text;
}

export function normalizeReadingOption(test: number, number: number, value: string, options: readonly string[]) {
  const index = options.indexOf(value);
  return index < 0 ? value : readingOptionValue(test, number, value, index);
}
