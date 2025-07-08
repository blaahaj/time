import { inspect } from "node:util";
import CalendarDate from "./calendarDate.js";

// An ISO calendar week
class CalendarWeek {
  public static fromCalendarDate(calendarDate: CalendarDate): CalendarWeek {
    // Calendar weeks start on Monday (day === 1) and end on Sunday (day === 7, but can be 0).
    // Calendar week 1 of a year is the one containing the first Thursday of that year.
    // Note that this can mean that the calendar week starts in the previous calendar year.

    // The first Thursday of the year is somewhere in the range Jan 1st to Jan 7th.

    // Ways that January 1st can be in the last calendar week of the previous year:
    //                                                 Sun  1
    // Mon  2, Tue  3, Wed  4, Thu  5, Fri  6, Sat  7, Sun  8 <-- week 1

    //                                         Sat  1, Sun  2
    // Mon  3, Tue  4, Wed  5, Thu  6, Fri  7, Sat  8, Sun  9 <-- week 1

    //                                 Fri  1, Sat  2, Sun  3,
    // Mon  4, Tue  5, Wed  6, Thu  7, Fri  8, Sat  9, Sun 10 <-- week 1

    // Ways that January 1st is in week 1
    // Mon 29, Tue 30, Wed 31, Thu  1, Fri  2, Sat  3, Sun  4
    // Mon 30, Tue 31, Wed  1, Thu  2, Fri  3, Sat  4, Sun  5
    // Mon 31, Tue  1, Wed  2, Thu  3, Fri  4, Sat  5, Sun  6
    // Mon  1, Tue  2, Wed  3, Thu  4, Fri  5, Sat  6, Sun  7

    // This calendar week's Thursday is in the same calendar week
    // as the requested date, so let's find that.
    const daysToThursday = 4 - (calendarDate.dayOfWeek || 7); // somewhere in [-3, +3]
    const thursday = calendarDate.addDays(daysToThursday);
    // by jumping forwards or backwards to Thursday, we may of
    // course hopped into a different calendar year.

    // This Thursday, and the first Thursday of whichever year this Thursday is in,
    // are in the same calendar year, so let's find that:
    const year = thursday.year;
    const newYearsDay = new CalendarDate(year, 0, 1);
    const daysBetweenNewYearsAndThursday = thursday.daysSince(newYearsDay);
    const firstThursdayOfTheYear = newYearsDay.addDays(
      daysBetweenNewYearsAndThursday % 7,
    );

    return new CalendarWeek(
      year,
      thursday.daysSince(firstThursdayOfTheYear) / 7 + 1,
      thursday.addDays(-3),
    );
  }

  private constructor(
    public readonly year: number,
    public readonly week: number,
    public readonly firstDate: CalendarDate,
  ) {}

  public addWeeks(n: number): CalendarWeek {
    return CalendarWeek.fromCalendarDate(this.firstDate.addDays(7 * n));
  }

  public compareTo(other: CalendarWeek) {
    return this.year - other.year || this.week - other.week;
  }

  public toString(): string {
    return `${this.year.toFixed(0).padStart(4, "0")}-W${this.week.toFixed(0).padStart(2, "0")}`;
  }

  public [inspect.custom]() {
    return `<CalendarWeek ${this.toString()}>`;
  }
}

export default CalendarWeek;
