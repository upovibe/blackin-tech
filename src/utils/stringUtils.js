// Capitalizes the first letter of each word in a string
export const capitalizeWords = (text) => {
    return text.replace(/\b\w/g, char => char.toUpperCase());
  };
  