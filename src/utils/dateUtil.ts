import * as _ from 'lodash';

const WEEKDAYS = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'];

const dateUtil = {
  getStringArrayBetweenTwoDates(firstDate: any, secondDate: any): string[] {
    const result = [];
    const daysbetween = this.calculateDaysBetweenDates(firstDate, secondDate);
    for (let index = 0; index <= daysbetween; index++) {
      const nextDay = this.addDaysToDate(firstDate, index);
      result.push(this.createStringFromDate(nextDay));
    }
    return result;
  },

  calculateDaysBetweenDates(firstDate: any, secondDate: any): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((new Date(secondDate).getTime() - new Date(firstDate).getTime()) / oneDay));
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

  isDateInRange(date: string | Date, lowerLimit: string | Date, upperLimit: string | Date): boolean {
    return this.isAfterEquals(date, lowerLimit) && this.isBeforeEquals(date, upperLimit);
  },

  minuteFromHour(hour: string): number {
    const [h, m] = _.split(hour, ':', 2);
    return 60 * parseInt(h, 10) + parseInt(m, 10);
  },

  hourFromMinute(minute: number): string {
    minute = minute % 1440;
    const h = ('00' + Math.floor(minute / 60)).slice(-2);
    const m = ('00' + minute % 60).slice(-2);
    return `${h}:${m}`;
  },

  getLastDayInMonth(year: number, month: number) {
    return (month === 2) ? (!((year % 4) || (!(year % 100) && (year % 400))) ? 29 : 28)
      : 30 + ((month + (month >> 3)) & 1);
  },

  isDateInSelectedWeekday(date: string | Date, selectedDays: string[]): boolean {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    const selectedDaysIndexes: number[] = [];
    _.forEach(selectedDays, (day) => {
      const indexOfDay = WEEKDAYS.indexOf(day);
      if (indexOfDay >= 0) { selectedDaysIndexes.push(indexOfDay); }
    });
    return _.includes(selectedDaysIndexes, date.getDay());
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


};

export default dateUtil;
