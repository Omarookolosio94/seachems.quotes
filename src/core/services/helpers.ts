export const formatSimpleDate = (date: any, isDash = false) => {
  const d = new Date(date);
  if (d.toString() === "Invalid Date") return null;

  var formattedDate = "";
  if (!isDash) {
    formattedDate = `${appendLeadZero(d.getDate())}/${appendLeadZero(
      d.getMonth() + 1
    )}/${d.getFullYear()}`;
  } else {
    formattedDate = `${appendLeadZero(d.getDate())}-${appendLeadZero(
      d.getMonth() + 1
    )}-${d.getFullYear()}`;
  }
  return formattedDate;
};

export const formatToFormDate = (date: any, isDash = false) => {
  if (date == null || date?.length < 1) return "";
  const d = new Date(date);

  var formattedDate = `${d.getFullYear()}-${appendLeadZero(
    d.getMonth() + 1
  )}-${appendLeadZero(d.getDate())}`;

  return formattedDate;
};

const timeFormat12Hour = (date: any) => {
  let h = date.getHours();
  let m = date.getMinutes();
  let ampm = h >= 12 ? "pm" : "am";

  h = h % 12; //reminder
  h = h ? h : 12;

  m = m.toString().padStart(2, "0");
  const formatedTimeString = h + ":" + m + " " + ampm;
  return formatedTimeString;
};

const appendLeadZero = (val: any) => (Number(val) > 9 ? val : `0${val}`);

export const formatCurrency = (value: any) => {
  if (value) {
    let val = value;
    val = val ? parseFloat(val).toFixed(2) : 0.0;
    return val === 0 ? "₦ 0.00" : `₦ ${Number(val).toLocaleString("en-US")}`;
  }
  return "₦ 0.00";
};

export const formatNumber = (value: any) => {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }

  let val: string | number = parseFloat(value);
  if (isNaN(val)) {
    return "0";
  }

  if (!String(value).includes(".")) {
    return `${Number(val).toLocaleString("en-US")}`;
  }

  val = val.toFixed(2);
  return `${Number(val).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const getDataFromSession = (name: string) => {
  try {
    const data: any = sessionStorage.getItem(name);
    if (
      data != null &&
      data != undefined &&
      typeof JSON.parse(data) === "object" &&
      !Array.isArray(data)
    ) {
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * recieve a date value and return true if the date is today. Otherwise, false.
 * @param {String} date
 * @returns {Boolean}
 */
export const isToday = (date: any) => {
  const theDate = new Date(date);
  const today = new Date();
  return today.setHours(0, 0, 0, 0) === theDate.setHours(0, 0, 0, 0);
};

/**
 * recieve a date-time string and return date
 * @param {String} dateString
 * @returns {String} Format: Tues, 24 Sept 2019
 */
export const getDate = (
  inputtedDate: string,
  showYear = true,
  showTime = true
) => {
  if (inputtedDate == null || inputtedDate?.length < 0) {
    return "";
  }

  const date = new Date(inputtedDate);
  var formattedDate = `${MONTHS[date.getMonth()]} ${date.getDate()}`;
  if (showYear) formattedDate += ` ${date.getFullYear()}`;
  if (showTime) formattedDate += ` ${timeFormat12Hour(date)}`;

  return formattedDate;
};

export const expandRow = (uniqueId: string | number, expandedRows: any) => {
  const currentExpandedRows: any = expandedRows;
  const isRowExpanded: any = currentExpandedRows.includes(uniqueId);
  const obj: any = {};

  isRowExpanded ? (obj[uniqueId] = false) : (obj[uniqueId] = true);

  const newExpandedRows = isRowExpanded
    ? currentExpandedRows.filter((id: string) => id !== uniqueId)
    : currentExpandedRows.concat(uniqueId);

  return {
    obj,
    newExpandedRows,
  };
};

export const openInNewTab = (url?: string) => {
  if (url == null || url?.length < 1) {
    return;
  }
  var isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
  if (isChrome) {
    openNewBackgroundTab(url);
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

// TODO: Fix open new tab in background, current functon does not work
export const openNewBackgroundTab = (url: string) => {
  var a = document.createElement("a");
  a.href = url;
  var evt: any = document.createEvent("MouseEvents");
  //the tenth parameter of initMouseEvent sets ctrl key
  evt.initMouseEvent(
    "click",
    true,
    true,
    window,
    0,
    0,
    0,
    0,
    0,
    true,
    false,
    false,
    false,
    0,
    null
  );
  a.dispatchEvent(evt);
};

export const printSection = (section: string, title: string) => {
  // Add a class to the section of the page that you want to print.
  const sectionElement = document.querySelector("." + section);
  sectionElement.classList.add("print-section");

  const styleElement = document.createElement("style");
  styleElement.textContent = `
    body > *:not(.print-section) {
      display: none;
    }
  `;

  document.head.appendChild(styleElement);

  const titleBefore = document.title;
  document.title = title;
  window.print();
  document.head.removeChild(styleElement);
  document.title = titleBefore;
};

export const cx = (...classNames: string[]) =>
  classNames.filter(Boolean).join(" ");

export const numbersOnly = (e: any) => {
  if (isNaN(e?.key) && e?.key !== "Backspace") {
    e.preventDefault();
  }
};

export const filterProductQuery = (
  query: ProductQuery
): Partial<ProductQuery> => {
  const filteredQuery: any = {};

  // Iterate through each key-value pair in the query object
  Object.entries(query).forEach(([key, value]) => {
    const typedKey = key as keyof ProductQuery;

    // Only add to filteredQuery if the value is a non-empty string, a true boolean, or a number
    if (
      (typeof value === "string" && value !== "") ||
      (typeof value === "boolean" && value === true) ||
      typeof value === "number"
    ) {
      filteredQuery[typedKey] = value as ProductQuery[typeof typedKey];
    }
  });

  return filteredQuery;
};

export const filterQuotationQuery = (
  query: QuotationQuery
): Partial<QuotationQuery> => {
  const filteredQuery: any = {};

  Object.entries(query).forEach(([key, value]) => {
    const typedKey = key as keyof QuotationQuery;

    if (
      (typeof value === "string" && value !== "") ||
      (typeof value === "boolean" && value === true) ||
      typeof value === "number"
    ) {
      filteredQuery[typedKey] = value as QuotationQuery[typeof typedKey];
    }
  });

  return filteredQuery;
};

export const clearSessionAndLogout = async () => {
  localStorage.clear();
  sessionStorage.clear();
  //isExpiredSession && localStorage.setItem('se', true);
  window.location.assign("/");
};
