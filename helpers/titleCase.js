const titleCase = (str) => {
  if ((str === null) || (str === '')) return false;
  const mStr = str.toString();

  return mStr.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

const snakeToTitleCase = (str) => {
  if ((str === null) || (str === '')) return false;
  const mStr = str.toString();

  return mStr.split('_').map((item) => item.charAt(0).toUpperCase() + item.substring(1)).join(' ');
};

module.exports = { titleCase, snakeToTitleCase };
