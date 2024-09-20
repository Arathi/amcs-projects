import dayjs from "dayjs";

const GIGA = 1024 * 1024 * 1024;
const MEGA = 1024 * 1024;
const KILO = 1024;

const BILLION = 1_000_000_000;
const MILLION = 1_000_000;
const THOUSAND = 1_000;

const YI = 1_0000_0000;
const WAN = 1_0000;

export function toFileSize(length: number, fractionDigits: number = 3) {
  let fileSize = length;
  let unit = "B";
  if (length >= GIGA) {
    fileSize = length / GIGA;
    unit = "GB";
  } else if (length >= MEGA) {
    fileSize = length / MEGA;
    unit = "MB";
  } else if (length >= KILO) {
    fileSize = length / KILO;
    unit = "KB";
  }

  return `${fileSize.toFixed(fractionDigits)} ${unit}`;
}

export function toHumanReadable(
  value: number,
  fractionDigits: number = 3,
  chinese: boolean = false
) {
  let numeric = value;
  let unit = "";

  if (chinese) {
    if (value >= YI) {
      numeric = value / YI;
      unit = "亿";
    } else if (value >= WAN) {
      numeric = value / WAN;
      unit = "万";
    }
  } else {
    if (value >= BILLION) {
      numeric = value / BILLION;
      unit = "B";
    } else if (value >= MILLION) {
      numeric = value / MILLION;
      unit = "M";
    } else if (value >= THOUSAND) {
      numeric = value / THOUSAND;
      unit = "K";
    }
  }

  if (unit.length > 0) {
    return `${numeric.toFixed(fractionDigits)} ${unit}`;
  }
  return value;
}

export function formatDate(iso: string, pattern: string = "YYYY-MM-DD") {
  const day = dayjs(iso);
  return day.format(pattern);
}
