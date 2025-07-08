# @blaahaj/time

Date / time management.

## CalendarDate

A date in the Gregorian calendar.

Getting a `CalendarDate` from a `Date`:

```typescript
import { CalendarDate } from "@blaahaj/time";

const now = new Date();

// from the point of view of your local time zone
const localToday = CalendarDate.fromLocalDate(now);
// <CalendarDate 2025-07-08>

// from the point of view of UTC
const utcToday = CalendarDate.fromUTCDate(now);
```

Properties of a `CalendarDate`:

```text
> today
<CalendarDate 2025-07-08>

> today.year
2025
> today.month0    // 0-11
6
> today.day1      // 1-31
8
> today.dayOfWeek // 0 = Sunday, 1 = Monday, etc
2
```

Add / subtract days:

```text
> today.addDays(300)
<CalendarDate 2026-05-04>
> today.addDays(-100000)
<CalendarDate 1751-09-23>

// The start of the Gregorian calendar
> start = CalendarDate.fromUTCDate(new Date("1582-10-15T00:00:00Z"))
<CalendarDate 1582-10-15>
> start.addDays(1)
<CalendarDate 1582-10-16>
> start.addDays(-1)
Uncaught Error: Date is out of bounds
```

Other methods:

```text
> today.daysSince(start)
161704

> date.compareTo(anotherDate) // returns < 0 if date < anotherDate, etc

> today.toString()
'2025-07-08'

// Converting back to Date
> today.toMidnightLocal()
2025-07-07T22:00:00.000Z
> today.toMidnightUTC()
2025-07-08T00:00:00.000Z

> today.calendarWeek
<CalendarWeek 2025-W28>
```

## CalendarWeek

An ISO week.

You can get a CalendarWeek from a CalendarDay, or from another CalendarWeek:

```text
> thisWeek = CalendarWeek.fromCalendarDate(today)
<CalendarWeek 2025-W28>
// (this is exactly equivalent to "today.calendarWeek")

> thisWeek.addWeeks(40)
<CalendarWeek 2026-W16>
```

Properties of a week:

```text
> thisWeek.year
2025
> thisWeek.week
28
> thisWeek.firstDate
<CalendarDate 2025-07-07>
```

Other methods:

```text
> thisWeek.toString()
'2025-W28'

> week.compareTo(anotherWeek) // returns < 0 if week < anotherWeek, etc
```
