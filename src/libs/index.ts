import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleTrimValue = (data: any) => {
  for (const key in data) {
    if (typeof data[key] === "string") {
      data[key] = data[key].trim();
    }
  }
  return data;
};

export const getLocalDateTime = (): string => {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const localTime = dayjs().tz(tz).format();
  return localTime;
};

export const actionScrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
};
export const numberWithCommas = (x: number | undefined) => {
  if (x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return 0;
};

export const handleCurrency = (x?: number | null) => {
  return typeof x === "number" ? `¥${numberWithCommas(x)}` : null;
};

export const formatTime12Hour = (start_time: string, end_time: string) => {
  const formatTo12Hour = (time24: string): { time: string; period: string } => {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "pm" : "am";
    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return {
      time: `${hours12}:${minutes.toString().padStart(2, "0")}`,
      period,
    };
  };

  const start = formatTo12Hour(start_time);
  const end = formatTo12Hour(end_time);

  if (start.period === "pm" && end.period === "pm") {
    return `${start.time} - ${end.time} pm`;
  }
  if (start.period === "am" && end.period === "am") {
    return `${start.time} - ${end.time} am`;
  }
  return `${start.time} ${start.period} - ${end.time} ${end.period}`;
};
