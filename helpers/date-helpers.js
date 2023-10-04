const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
};

const toUnixTimestamp = (date) => new Date(date).getTime() / 1000;

module.exports = {
  addDays,
  toUnixTimestamp,
};
