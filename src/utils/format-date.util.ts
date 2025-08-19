type DateFormat =
  | 'dd/mm/yyyy'
  | 'dd mm yyyy'
  | 'dd/mm/yyyy hh:mm'
  | 'dd/mmm/yyyy'
  | 'dd mmm yyyy'
  | 'dd/mmm/yyyy hh:mm'
  | 'dd mmm yyyy hh:mm';

export function formatDate(
  dateString: string | Date,
  format: DateFormat = 'dd/mm/yyyy'
): string {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const day: string = String(date.getDate()).padStart(2, '0');
  const monthNum: string = String(date.getMonth() + 1).padStart(2, '0');
  const year: number = date.getFullYear();
  const hours: string = String(date.getHours()).padStart(2, '0');
  const minutes: string = String(date.getMinutes()).padStart(2, '0');

  const monthNames: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthStr: string = monthNames[date.getMonth()];

  const patterns: Record<DateFormat, string> = {
    'dd/mm/yyyy': `${day}/${monthNum}/${year}`,
    'dd mm yyyy': `${day} ${monthNum} ${year}`,
    'dd/mm/yyyy hh:mm': `${day}/${monthNum}/${year} ${hours}:${minutes}`,
    'dd/mmm/yyyy': `${day}/${monthStr}/${year}`,
    'dd mmm yyyy': `${day} ${monthStr} ${year}`,
    'dd/mmm/yyyy hh:mm': `${day}/${monthStr}/${year} ${hours}:${minutes}`,
    'dd mmm yyyy hh:mm': `${day} ${monthStr} ${year} ${hours}:${minutes}`,
  };

  return patterns[format];
}
