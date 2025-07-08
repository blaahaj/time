import { inspect } from "node:util";
import CalendarWeek from "./calendarWeek.js";

// A date in the Gregorian calendar
class CalendarDate {
  // "When the new calendar was put in use [...] the Julian calendar day
  // Thursday, 4 October 1582 was followed by the first day of the
  // Gregorian calendar, Friday, 15 October 1582".
  // https://en.wikipedia.org/wiki/Gregorian_calendar
  private static STUB_OF_FIRST_VALID_DATE = {
    year: 1582,
    month0: 9,
    day1: 15,
  } as CalendarDate;

  public static fromLocalDate(date: Date) {
    return new CalendarDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
  }

  public static fromUTCDate(date: Date) {
    return new CalendarDate(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    );
  }

  public static fromYM0D(
    year: number,
    month0: number,
    day1: number,
  ): CalendarDate {
    return new CalendarDate(year, month0, day1);
  }

  public static fromYM1D(
    year: number,
    month1: number,
    day1: number,
  ): CalendarDate {
    return new CalendarDate(year, month1 - 1, day1);
  }

  private readonly midnightUTC: Date;

  constructor(
    public readonly year: number,
    public readonly month0: number,
    public readonly day1: number,
  ) {
    if (this.compareTo(CalendarDate.STUB_OF_FIRST_VALID_DATE) < 0)
      throw new Error("Date is out of bounds");

    this.midnightUTC = new Date(Date.UTC(year, month0, day1));

    if (
      this.midnightUTC.getUTCFullYear() !== year ||
      this.midnightUTC.getUTCMonth() !== month0 ||
      this.midnightUTC.getUTCDate() !== day1
    )
      throw new Error("Arguments out of range");
  }

  public get dayOfWeek(): number {
    return this.midnightUTC.getUTCDay();
  }

  public setParts(opts: {
    year?: number;
    month0?: number;
    day1?: number;
  }): CalendarDate {
    return CalendarDate.fromYM0D(
      opts.year ?? this.year,
      opts.month0 ?? this.month0,
      opts.day1 ?? this.day1,
    );
  }

  public addDays(n: number): CalendarDate {
    const date = new Date(
      Date.UTC(this.year, this.month0, this.day1) + n * 86400 * 1000,
    );
    return CalendarDate.fromUTCDate(date);
  }

  public toMidnightUTC(): Date {
    return new Date(this.midnightUTC.getTime());
  }

  public toMidnightLocal(): Date {
    return new Date(this.year, this.month0, this.day1);
  }

  public daysSince(other: CalendarDate): number {
    return (
      (this.toMidnightUTC().getTime() - other.toMidnightUTC().getTime()) /
      86400 /
      1000
    );
  }

  public get calendarWeek(): CalendarWeek {
    return CalendarWeek.fromCalendarDate(this);
  }

  public compareTo(other: CalendarDate) {
    return (
      this.year - other.year ||
      this.month0 - other.month0 ||
      this.day1 - other.day1
    );
  }

  public toString(): string {
    return `${this.year.toFixed(0).padStart(4, "0")}-${(this.month0 + 1).toFixed(0).padStart(2, "0")}-${this.day1.toFixed(0).padStart(2, "0")}`;
  }

  public [inspect.custom]() {
    return `<CalendarDate ${this.toString()}>`;
  }
}

export default CalendarDate;
