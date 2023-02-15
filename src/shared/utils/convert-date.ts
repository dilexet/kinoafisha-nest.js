import * as moment from 'moment';

export const convertDate = (date: Date): string => {
  const newDate = new Date(date).toLocaleString();
  return moment(newDate, 'DD.MM.YYYY, HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
};
