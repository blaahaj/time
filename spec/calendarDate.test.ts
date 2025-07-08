import assert, * as a from "node:assert";
import * as t from "node:test";

import { CalendarDate } from "../src/index.js";
import { inspect } from "node:util";

// 2006-06-27T08:54:16.223Z
const knownDate = new Date(1151398456223);

void t.suite("CalendarDate", () => {
  void t.suite("getting a CalendarDate", () => {
    void t.it("can build from a Date, using UTC", () => {
      const date = CalendarDate.fromUTCDate(knownDate);

      a.strictEqual(date.year, 2006);
      a.strictEqual(date.month0, 5);
      a.strictEqual(date.day1, 27);
      a.strictEqual(date.dayOfWeek, 2);
    });

    // Not fully tested: fromLocalDate
    void t.it("can build from a Date, using the local timezone", () => {
      a.doesNotThrow(() => CalendarDate.fromLocalDate(knownDate));
    });

    void t.it("can build from year, month0, and date", () => {
      const date = CalendarDate.fromYM0D(2006, 5, 27);
      a.strictEqual(date.year, 2006);
      a.strictEqual(date.month0, 5);
      a.strictEqual(date.day1, 27);
      a.strictEqual(date.dayOfWeek, 2);
    });

    void t.it("can build from year, month1, and date", () => {
      const date = CalendarDate.fromYM1D(2006, 5, 27);
      a.strictEqual(date.year, 2006);
      a.strictEqual(date.month0, 4);
      a.strictEqual(date.day1, 27);
      a.strictEqual(date.dayOfWeek, 6);
    });

    void t.it("rejects invalid YM0D combinations", () => {
      a.throws(() => CalendarDate.fromYM0D(2006, 1, 31));
    });

    void t.it("rejects invalid YM1D combinations", () => {
      a.throws(() => CalendarDate.fromYM1D(2006, 2, 31));
    });

    void t.it("rejects invalid YM1D combinations (non-integer)", () => {
      a.throws(() => CalendarDate.fromYM1D(2006, 1.5, 1));
    });
  });

  void t.suite("properties", () => {
    const date = CalendarDate.fromUTCDate(knownDate);

    void t.it("year", () => a.strictEqual(date.year, 2006));
    void t.it("month0", () => a.strictEqual(date.month0, 5));
    void t.it("day1", () => a.strictEqual(date.day1, 27));
    void t.it("calendarWeek", () =>
      a.strictEqual(date.calendarWeek.toString(), "2006-W26"),
    );

    void t.it("toString", () => {
      a.strictEqual(date.toString(), "2006-06-27");
    });

    void t.it("inspects", () =>
      a.strictEqual(inspect(date), "<CalendarDate 2006-06-27>"),
    );
  });

  void t.suite("date arithmetic", () => {
    const date1 = CalendarDate.fromYM1D(2025, 1, 8);
    const date2 = CalendarDate.fromYM1D(2024, 12, 28);
    const date3 = CalendarDate.fromYM1D(2024, 12, 28);

    void t.suite("addDays", () => {
      void t.it("positive", () =>
        a.strictEqual(date1.addDays(30).toString(), "2025-02-07"),
      );

      void t.it("negative", () =>
        a.strictEqual(date1.addDays(-30).toString(), "2024-12-09"),
      );
    });

    void t.suite("daysSince", () => {
      void t.it("positive", () => a.strictEqual(date1.daysSince(date2), 11));
      void t.it("negative", () => a.strictEqual(date2.daysSince(date1), -11));
    });

    void t.it("compareTo", () => {
      assert(date1.compareTo(date2) > 0);
      assert(date2.compareTo(date1) < 0);
      assert(date3.compareTo(date2) === 0);
    });
  });

  void t.suite("setParts", () => {
    const date = CalendarDate.fromYM1D(2025, 1, 8);

    // 8 combinations of ways to set (2^3), so let's just test a couple

    void t.it("can set the month and day", () =>
      a.strictEqual(
        date.setParts({ month0: 11, day1: 7 }).toString(),
        "2025-12-07",
      ),
    );

    void t.it("can set the year", () =>
      a.strictEqual(date.setParts({ year: 2000 }).toString(), "2000-01-08"),
    );

    void t.it("rejects invalid YMD combinations", () =>
      a.throws(() => date.setParts({ month0: 1, day1: 30 })),
    );
  });

  void t.suite("toMidnightUTC", () => {
    const date = CalendarDate.fromUTCDate(knownDate).toMidnightUTC();

    a.deepStrictEqual(
      {
        y: date.getUTCFullYear(),
        m: date.getUTCMonth(),
        d: date.getUTCDate(),
        H: date.getUTCHours(),
        M: date.getUTCMinutes(),
        S: date.getUTCSeconds(),
      },
      {
        y: 2006,
        m: 5,
        d: 27,
        H: 0,
        M: 0,
        S: 0,
      },
    );
  });

  void t.suite("toMidnightLocal", () => {
    const date = CalendarDate.fromUTCDate(knownDate).toMidnightLocal();

    a.deepStrictEqual(
      {
        y: date.getFullYear(),
        m: date.getMonth(),
        d: date.getDate(),
        H: date.getHours(),
        M: date.getMinutes(),
        S: date.getSeconds(),
      },
      {
        y: 2006,
        m: 5,
        d: 27,
        H: 0,
        M: 0,
        S: 0,
      },
    );
  });

  void t.suite("limit of the Gregorian calendar", () => {
    // Earliest allowed date: 15 Oct 1582
    // ways to make a date:

    // fromUTCDate
    // fromLocalDate

    void t.suite("fromYM0D", () => {
      void t.it("on the limit", () =>
        a.doesNotThrow(() => CalendarDate.fromYM0D(1582, 9, 15)),
      );
      void t.it("beyond the limit", () =>
        a.throws(() => CalendarDate.fromYM0D(1582, 9, 14)),
      );
    });

    void t.suite("fromYM1D", () => {
      void t.it("on the limit", () =>
        a.doesNotThrow(() => CalendarDate.fromYM1D(1582, 10, 15)),
      );
      void t.it("beyond the limit", () =>
        a.throws(() => CalendarDate.fromYM1D(1582, 10, 14)),
      );
    });

    // add
    // setparts
  });
});
