import { useState, useMemo } from "react";
import dayjs from "dayjs";

export const useDatePicker = () => {
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const years = useMemo(() => Array.from({ length: 100 }, (_, i) => 2025 - i), []);

  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(2025);

  const days = useMemo(() => {
    const daysInMonth = dayjs(`${year}-${String(month).padStart(2, "0")}-01`).daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [month, year]);

  const monthOptions = useMemo(() => [{ label: "月", value: "" }, ...months.map((month) => ({ label: month.toString(), value: month.toString() }))], [months]);
  const yearOptions = useMemo(() => [{ label: "年", value: "" }, ...years.map((year) => ({ label: year.toString(), value: year.toString() }))], [years]);

  const dayOptions = useMemo(() => [{ label: "日", value: "" }, ...days.map((day) => ({ label: day.toString(), value: day.toString() }))], [days]);

  return {
    setMonth,
    setYear,
    monthOptions,
    yearOptions,
    dayOptions,
  };
};
