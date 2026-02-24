export const groupMatchesByMonth = (matches) => {
  return matches.reduce((acc, match) => {
    const date = new Date(match.starting_at);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const key = `${month} ${year}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(match);
    return acc;
  }, {});
};
