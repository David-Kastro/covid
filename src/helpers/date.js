export const formatDate = timeInSeconds => {
  const date = new Date(0);
  date.setSeconds(timeInSeconds);

  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  const year = date.getFullYear();
  const hour = date.getHours();

  return `${day}/${month}/${year} às ${hour}h`;
}

export const formatDateFromTimestamp = timestamp => {
  const date = new Date(timestamp);

  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  const year = date.getFullYear();
  const hour = date.getHours();

  return `${day}/${month}/${year} às ${hour}h`;
}
