// Capitalizes the first letter of each word in a string
export const capitalizeWords = (text) => {
    return text.replace(/\b\w/g, char => char.toUpperCase());
  };
  
  // Utility function to convert a string to lowercase
export const toLowerCase = (text) => {
  if (typeof text === "string") {
    return text.toLowerCase();
  }
  return text; // return as-is if it's not a string
};
