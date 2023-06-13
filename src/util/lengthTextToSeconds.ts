export const lengthTextToSeconds = (lengthText: string): number => {
  const parts = lengthText.split(':');

  let duration = 0;

  parts.forEach((part, index) => {
    duration += parseInt(part) * Math.pow(60, parts.length - index - 1);
  });

  return duration;
};
