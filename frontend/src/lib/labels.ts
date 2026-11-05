export const planStatus: Record<string, string> = {
  PLANNED: "Заплановано",
  IN_PROGRESS: "У процесі",
  DONE: "Виконано",
  POSTPONED: "Перенесено",
};

export const scheduleStatus: Record<string, string> = {
  PLANNED: "Заплановано",
  CONFIRMED: "Підтверджено",
  COMPLETED: "Проведено",
  CANCELLED: "Скасовано",
};

export const requestStatus: Record<string, string> = {
  NEW: "Нова",
  REVIEWING: "Розглядається",
  APPROVED: "Схвалена",
  REJECTED: "Відхилена",
};

export const resultType: Record<string, string> = {
  PROJECT: "Проєкт",
  RESEARCH: "Дослідження",
  PRESENTATION: "Презентація",
  ARTICLE: "Стаття",
  REPORT: "Доповідь",
  DEVELOPMENT: "Розробка",
  CONFERENCE: "Конференція",
  CONTEST: "Конкурс",
  OTHER: "Інше",
};

export const resultStatus: Record<string, string> = {
  DRAFT: "Чернетка",
  IN_PROGRESS: "У процесі",
  COMPLETED: "Завершено",
  PUBLISHED: "Опубліковано",
};

export const materialType: Record<string, string> = {
  PDF: "PDF",
  PRESENTATION: "Презентація",
  DOCUMENT: "Документ",
  LINK: "Посилання",
  SQL: "SQL-файл",
  VIDEO: "Відео",
  OTHER: "Інше",
};

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("uk-UA", { dateStyle: "long" }).format(new Date(value));
}

export function formatDateShort(value: string) {
  return new Intl.DateTimeFormat("uk-UA", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(value)
  );
}

export function fullName(p: { firstName: string; lastName: string }) {
  return `${p.firstName} ${p.lastName}`;
}

export function splitLines(text: string) {
  return text
    .split(/[;\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}
