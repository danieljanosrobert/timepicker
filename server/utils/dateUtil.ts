import * as _ from 'lodash';

const dateUtil = {
  minuteFromHour(hour: string): number {
    const [h, m] = _.split(hour, ':', 2);
    return 60 * parseInt(h, 10) + parseInt(m, 10);
  },
  
  addDaysToDate(dateString: string, daysToAdd: number): Date {
    const dateOfString = new Date(dateString);
    dateOfString.setDate(dateOfString.getDate() + daysToAdd);
    return dateOfString;
  },

  createStringFromDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  },

  isAfter(firstDate: string | Date, secondDate: string | Date): boolean {
    if (typeof firstDate === 'string') {
      firstDate = new Date(firstDate);
    }
    if (typeof secondDate === 'string') {
      secondDate = new Date(secondDate);
    }
    return firstDate.getTime() > secondDate.getTime();
  },

  isAfterEquals(firstDate: string | Date, secondDate: string | Date): boolean {
    if (typeof firstDate === 'string') {
      firstDate = new Date(firstDate);
    }
    if (typeof secondDate === 'string') {
      secondDate = new Date(secondDate);
    }
    return firstDate.getTime() >= secondDate.getTime();
  },

  isBefore(firstDate: string | Date, secondDate: string | Date): boolean {
    if (typeof firstDate === 'string') {
      firstDate = new Date(firstDate);
    }
    if (typeof secondDate === 'string') {
      secondDate = new Date(secondDate);
    }
    return firstDate.getTime() < secondDate.getTime();
  },

  isBeforeEquals(firstDate: string | Date, secondDate: string | Date): boolean {
    if (typeof firstDate === 'string') {
      firstDate = new Date(firstDate);
    }
    if (typeof secondDate === 'string') {
      secondDate = new Date(secondDate);
    }
    return firstDate.getTime() <= secondDate.getTime();
  },

  equals(firstDate: string | Date, secondDate: string | Date): boolean {
    if (typeof firstDate === 'string') {
      firstDate = new Date(firstDate);
    }
    if (typeof secondDate === 'string') {
      secondDate = new Date(secondDate);
    }
    return firstDate.getTime() === secondDate.getTime();
  },
}

export default dateUtil;
