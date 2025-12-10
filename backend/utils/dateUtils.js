function formatDate(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function formatTime(date) {
  return new Date(date).toISOString().slice(11, 16);
}

function addHours(date, hours) {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

function isSameDay(date1, date2) {
  return formatDate(date1) === formatDate(date2);
}

module.exports = { formatDate, formatTime, addHours, isSameDay };

