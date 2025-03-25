interface IGetTimePassed {
  pastDate: Date;
  locale?: string;
}

export function getTimePassed({ pastDate, locale = 'es' }: IGetTimePassed) {
  const now = new Date();
  const diffInMilliseconds = now.getTime() - pastDate.getTime();

  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25;
  const millisecondsInMonth = 1000 * 60 * 60 * 24 * 30;
  const millisecondsInDay = 1000 * 60 * 60 * 24;

  if (diffInMilliseconds >= millisecondsInYear) {
    const years = Math.floor(diffInMilliseconds / millisecondsInYear);
    return locale === 'es'
      ? `${years} año${years > 1 ? 's' : ''}`
      : `${years} year${years > 1 ? 's' : ''}`;
  }if (diffInMilliseconds >= millisecondsInMonth) {
    const months = Math.floor(diffInMilliseconds / millisecondsInMonth);
    return locale === 'es'
      ? `${months} mes${months > 1 ? 'es' : ''}`
      : `${months} month${months > 1 ? 's' : ''}`;
  }if (diffInMilliseconds >= millisecondsInDay) {
    const days = Math.floor(diffInMilliseconds / millisecondsInDay);
    return locale === 'es'
      ? `${days} día${days > 1 ? 's' : ''}`
      : `${days} day${days > 1 ? 's' : ''}`;
  }
    return locale === 'es' ? 'Menos de un día' : 'Less than a day';
}
