export const groupMatchesByMonth = (matches) => {
  return matches.reduce((acc, match) => {
    const date = new Date(match.utcDate);
    const month = date.toLocaleString("default", { month: "long" });
    if (!acc[month]) acc[month] = [];
    acc[month].push(match);
    return acc;
  }, {});
};
