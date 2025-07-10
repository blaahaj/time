import assert, * as a from "node:assert";
import * as t from "node:test";

import { CalendarDate, CalendarWeek } from "../src/index.js";
import { inspect } from "node:util";

const knownCalendarDate = CalendarDate.fromYM1D(2006, 6, 27);

void t.suite("CalendarWeek", () => {
  void t.it("makes a week from a date", () => {
    const week = CalendarWeek.fromCalendarDate(knownCalendarDate);

    a.strictEqual(week.year, 2006);
    a.strictEqual(week.week, 26);
  });

  void t.it("handles Sunday", () => {
    const week = CalendarWeek.fromCalendarDate(
      CalendarDate.fromYM1D(2025, 1, 5), // a Sunday
    );
    a.strictEqual(week.toString(), "2025-W01");
  });

  void t.suite("various specific dates", () => {
    const addTest = (date: CalendarDate, expectedWeek: string) =>
      void t.it(date.toString(), () =>
        a.strictEqual(
          CalendarWeek.fromCalendarDate(date).toString(),
          expectedWeek,
        ),
      );

    addTest(CalendarDate.fromYM1D(2006, 1, 1), "2005-W52"); // Sunday
    addTest(CalendarDate.fromYM1D(2007, 1, 1), "2007-W01"); // Monday
    addTest(CalendarDate.fromYM1D(2008, 1, 1), "2008-W01"); // Tuesday
    addTest(CalendarDate.fromYM1D(2009, 1, 1), "2009-W01"); // Thursday
    addTest(CalendarDate.fromYM1D(2010, 1, 1), "2009-W53"); // Friday
    addTest(CalendarDate.fromYM1D(2011, 1, 1), "2010-W52"); // Saturday
    addTest(CalendarDate.fromYM1D(2012, 1, 1), "2011-W52"); // Sunday
    addTest(CalendarDate.fromYM1D(2013, 1, 1), "2013-W01"); // Monday
  });

  void t.suite("given a week", () => {
    const week = CalendarWeek.fromCalendarDate(knownCalendarDate);

    void t.it("can add weeks", () => {
      const otherWeek = week.addWeeks(30);
      a.strictEqual(otherWeek.year, 2007);
      a.strictEqual(otherWeek.week, 4);
    });

    void t.it("can subtract weeks", () => {
      const otherWeek = week.addWeeks(-3000);
      a.strictEqual(otherWeek.year, 1948);
      a.strictEqual(otherWeek.week, 53);
    });

    void t.it("compareTo", () => {
      const week1 = week;
      const week2 = week.firstDate.addDays(70).calendarWeek;
      const week3 = week2.addWeeks(0);

      assert(week1.compareTo(week2) < 0);
      assert(week2.compareTo(week1) > 0);
      assert(week3.compareTo(week2) === 0);
    });

    void t.it("toString", () => a.strictEqual(week.toString(), "2006-W26"));

    void t.it("inspects", () =>
      a.strictEqual(inspect(week), "<CalendarWeek 2006-W26>"),
    );
  });

  // Not tested
  // - the bounds of the Gregorian calendar
  // - all combinations of fromCalendarDate edges

  // Not provided
  // - setParts
  // - fromYearAndWeek
});
