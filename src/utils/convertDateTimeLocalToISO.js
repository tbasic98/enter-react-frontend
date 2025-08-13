export const convertDateTimeLocalToISO = (datetimeLocal) => {
  if (!datetimeLocal) return null;

  try {
    // Umjesto new Date(datetimeLocal) koji automatski dodaje timezone offset
    // Koristimo ovu metodu koja čuva lokalno vrijeme
    const date = new Date(datetimeLocal);

    // Dobijemo timezone offset u minutama (za Hrvatsku je -120 ljeti, -60 zimi)
    const timezoneOffset = date.getTimezoneOffset();

    // Dodamo offset nazad da dobijemo "pravo" lokalno vrijeme u UTC
    const localDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);

    return localDate.toISOString();
  } catch (error) {
    console.error("Error converting datetime:", error);
    return null;
  }
};
