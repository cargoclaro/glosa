const options = {
  weekday: "long" as const,
  year: "numeric" as const,
  month: "long" as const,
  day: "numeric" as const,
};

const capitalizer = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

const todayIs = (date: Date, locale?: string) => {
  const formattedDate = date.toLocaleDateString(locale ?? "es-ES", options);

  const finalDate = formattedDate
    .split(" ")
    .map((word) => capitalizer(word))
    .join(" ");

  return `${locale === "en-US" ? "Today is" : "Hoy es"} ${finalDate}`;
};

export default todayIs;
