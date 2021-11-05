export const getDateString = () => {
  return new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "/")
    .replace("T", " ");
};
