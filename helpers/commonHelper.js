const convertSecondToHour = (sec) =>
  sec === 0 ? 0 : Number((sec / 3600).toFixed(2));

module.exports = {
  convertSecondToHour,
};
