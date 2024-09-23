// Funtion to truncate the string to the given length and append it to the end of the string without truncation */
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};