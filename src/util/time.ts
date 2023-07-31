export const lengthTextToSeconds = (lengthText: string): number => {
  const parts = lengthText.split(':');

  let duration = 0;

  parts.forEach((part, index) => {
    duration += parseInt(part) * Math.pow(60, parts.length - index - 1);
  });

  return duration;
};

export const secondsToLengthText = (seconds: number): string => {
  if (seconds !== 0 && !seconds) {
    return '-:--';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const remainingSeconds = seconds - hours * 3600 - minutes * 60;

  const hoursText = hours.toString();
  const minutesText = minutes.toString().padStart(hours ? 2 : 1, '0');
  const secondsText = remainingSeconds.toString().padStart(2, '0');

  if (hours > 0) {
    return `${hoursText}:${minutesText}:${secondsText}`;
  }

  return `${minutesText}:${secondsText}`;
};
