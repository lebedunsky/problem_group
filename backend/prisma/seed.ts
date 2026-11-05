import { PrismaClient, ResultType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function avatar(name: string) {
  return `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=0f2744,134e4a,1e3a5f`;
}

async function main() {
  await prisma.material.deleteMany();
  await prisma.news.deleteMany();
  await prisma.category.deleteMany();
  await prisma.resultAuthor.deleteMany();
  await prisma.result.deleteMany();
  await prisma.presentation.deleteMany();
  await prisma.meetingParticipant.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.scheduleItem.deleteMany();
  await prisma.workPlanItem.deleteMany();
  await prisma.registrationRequest.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.groupSettings.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      login: "admin",
      passwordHash: await bcrypt.hash("Admin123!", 10),
      role: "ADMIN",
    },
  });

  await prisma.groupSettings.create({
    data: {
      name: "Проблемна група «DataLab»",
      topic: "Сучасні технології проєктування баз даних",
      shortDescription:
        "Студентська проблемна група факультету інформаційних технологій, яка досліджує сучасні підходи до проєктування, оптимізації та захисту баз даних.",
      description:
        "Проблемна група «DataLab» об'єднує студентів, які цікавляться реляційними та нереляційними базами даних, хмарними сховищами, аналітикою великих даних і застосуванням штучного інтелекту в роботі з даними. Група працює як навчально-дослідницький гурток: учасники готують доповіді, проєктують схеми БД, порівнюють СКБД і розробляють власні навчальні прототипи.",
      goal:
        "Сформувати практичні компетентності з проєктування баз даних і дати учасникам досвід дослідження сучасних технологій зберігання та обробки даних.",
      tasks:
        "Дослідити сучасні СКБД; опанувати нормалізацію та моделювання даних; порівнювати SQL і NoSQL; аналізувати індексацію та оптимізацію запитів; вивчати безпеку баз даних; готувати доповіді та навчальні матеріали; брати участь у конференціях і конкурсах.",
      activityDirections:
        "Проєктування реляційних баз даних; SQL; PostgreSQL; MySQL; NoSQL; MongoDB; нормалізація; оптимізація SQL-запитів; індексація; безпека баз даних; хмарні бази даних; сучасні технології роботи з даними; штучний інтелект у роботі з базами даних.",
      activityInfo:
        "Засідання відбуваються раз на два тижні. Кожне засідання має порядок денний, доповіді учасників, обговорення та фіксацію результатів. Між засіданнями учасники виконують дослідницькі завдання за індивідуальними напрямами.",
      leaderName: "Савка Надія Ярославівна",
      leaderTitle: "к.т.н., доцент кафедри інформаційних систем",
      leaderBio:
        "Викладає дисципліни «Системи обробки розподілених баз даних», «Захист інформації в комп'ютерних системах і мережах», «Техніко-економічне обґрунтування розробки комп’ютерних систем». Наукові інтереси: розподілені бази даних, захист інформації, проєктування комп’ютерних систем.",
      leaderPhotoUrl: avatar("Надія Савка"),
      email: "datalab@university.edu.ua",
      phone: "+380 44 123 45 67",
      address: "м. Київ, вул. Університетська, 12, ауд. 314",
      scheduleNote: "Четвер, 15:00–16:30, ауд. 314 (або онлайн у Teams)",
    },
  });

  const people = [
    ["Іван", "Петренко", "КН-21", 4, "Староста групи", "PostgreSQL", "Досліджує індексацію та плани виконання запитів у PostgreSQL."],
    ["Марія", "Коваль", "КН-22", 3, "Учасниця", "SQL / NoSQL", "Порівнює реляційні та документні моделі для навчальних систем."],
    ["Олексій", "Шевченко", "КН-21", 4, "Учасник", "Нормалізація", "Працює над кейсами декомпозиції схем до 3НФ і BCNF."],
    ["Анна", "Бондар", "КН-23", 2, "Учасниця", "MongoDB", "Моделює документні колекції та агрегаційні конвеєри."],
    ["Дмитро", "Лисенко", "КН-22", 3, "Учасник", "Оптимізація SQL", "Аналізує EXPLAIN ANALYZE та стратегії індексування."],
    ["Софія", "Ткаченко", "КН-21", 4, "Учасниця", "Безпека БД", "Досліджує ролі, RLS і аудит доступу в PostgreSQL."],
    ["Андрій", "Кравчук", "КН-23", 2, "Учасник", "MySQL", "Порівнює InnoDB, реплікацію та особливості MySQL 8."],
    ["Наталія", "Романюк", "КН-22", 3, "Учасниця", "Хмарні БД", "Вивчає Amazon RDS, Cloud SQL і керований PostgreSQL."],
    ["Богдан", "Савчук", "КН-24", 1, "Учасник", "SQL", "Опановує основи DDL/DML і проєктування ER-діаграм."],
    ["Катерина", "Гончар", "КН-21", 4, "Учасниця", "AI + дані", "Досліджує векторний пошук і RAG поверх баз даних."],
    ["Юрій", "Мельничук", "КН-22", 3, "Учасник", "Big Data", "Працює з колонковими сховищами та аналітичними запити."],
    ["Ірина", "Павленко", "КН-23", 2, "Учасниця", "Проєктування БД", "Готує навчальні схеми предметних областей."],
    ["Максим", "Сидоренко", "КН-24", 1, "Учасник", "NoSQL", "Порівнює key-value, document і graph-моделі."],
  ] as const;

  const participants = [];
  for (const [firstName, lastName, academicGroup, course, role, direction, bio] of people) {
    participants.push(
      await prisma.participant.create({
        data: {
          firstName,
          lastName,
          photoUrl: avatar(`${firstName} ${lastName}`),
          academicGroup,
          course,
          role,
          direction,
          bio,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@stud.university.edu.ua`,
        },
      })
    );
  }

  const byName = (last: string) => participants.find((p) => p.lastName === last)!;

  await prisma.registrationRequest.createMany({
    data: [
      {
        firstName: "Ольга",
        lastName: "Данилюк",
        email: "olha.danyliuk@stud.university.edu.ua",
        phone: "+380 93 111 22 33",
        academicGroup: "КН-24",
        course: 1,
        direction: "SQL",
        about: "Цікавлюсь основами реляційних баз даних і хочу навчитися проєктувати схеми.",
        motivation: "Хочу приєднатися до гуртка, щоб отримати практику поза лекціями.",
        status: "NEW",
      },
      {
        firstName: "Тарас",
        lastName: "Козак",
        email: "taras.kozak@stud.university.edu.ua",
        phone: "+380 67 222 33 44",
        academicGroup: "КН-22",
        course: 3,
        direction: "PostgreSQL",
        about: "Маю досвід з MySQL, хочу глибше вивчити PostgreSQL.",
        motivation: "Планую бакалаврську роботу зі сховищ даних.",
        status: "REVIEWING",
      },
    ],
  });

  const plan = [
    ["2025-09-18", "Проєктування реляційних баз даних", "ER-модель, сутності, зв'язки, ключі.", "Семінар", "DONE", "Павленко"],
    ["2025-10-02", "Нормалізація даних", "1НФ–3НФ, BCNF, приклади декомпозиції.", "Практикум", "DONE", "Шевченко"],
    ["2025-10-16", "Порівняння SQL та NoSQL", "Коли обирати реляційну, а коли документну модель.", "Дослідження", "DONE", "Коваль"],
    ["2025-11-13", "Дослідження PostgreSQL", "Типи індексів, MVCC, розширення.", "Доповідь", "DONE", "Петренко"],
    ["2026-02-12", "Оптимізація SQL-запитів", "EXPLAIN, статистика, антипатерни.", "Практикум", "DONE", "Лисенко"],
    ["2026-03-12", "Безпека баз даних", "Ролі, політики, шифрування, SQL-ін'єкції.", "Семінар", "DONE", "Ткаченко"],
    ["2026-09-18", "Хмарні бази даних", "Керовані сервіси, резервне копіювання, вартість.", "Дослідження", "IN_PROGRESS", "Романюк"],
    ["2026-10-16", "Векторний пошук і AI", "pgvector, ембединги, RAG-архітектури.", "Доповідь", "PLANNED", "Гончар"],
    ["2026-11-13", "Підсумок семестру", "Презентація результатів і матеріалів групи.", "Звіт", "PLANNED", "Петренко"],
  ] as const;

  for (const [date, title, description, workType, status, last] of plan) {
    await prisma.workPlanItem.create({
      data: {
        date: new Date(date),
        title,
        description,
        workType,
        status,
        responsibleId: byName(last).id,
      },
    });
  }

  const schedule = [
    ["2026-10-16", "15:00", "ауд. 314", "Векторний пошук у PostgreSQL", "CONFIRMED", "Гончар"],
    ["2026-10-30", "15:00", "ауд. 314", "Моделювання даних для аналітики", "PLANNED", "Мельничук"],
    ["2026-11-13", "15:00", "ауд. 314", "Підсумкове засідання осіннього семестру", "PLANNED", "Петренко"],
    ["2026-11-27", "15:00", "Microsoft Teams", "Огляд NoSQL: Redis і Neo4j", "PLANNED", "Сидоренко"],
  ] as const;

  for (const [date, time, location, topic, status, last] of schedule) {
    await prisma.scheduleItem.create({
      data: {
        date: new Date(date),
        time,
        location,
        topic,
        status,
        responsibleId: byName(last).id,
      },
    });
  }

  async function meeting(data: {
    number: number;
    date: string;
    time: string;
    topic: string;
    shortDescription: string;
    agenda: string;
    discussion: string;
    results: string;
    conclusions: string;
    attendees: string[];
    talks: { last: string; title: string; description: string; minutes: number }[];
  }) {
    const created = await prisma.meeting.create({
      data: {
        number: data.number,
        date: new Date(data.date),
        time: data.time,
        topic: data.topic,
        shortDescription: data.shortDescription,
        agenda: data.agenda,
        discussion: data.discussion,
        results: data.results,
        conclusions: data.conclusions,
        participants: {
          create: data.attendees.map((last) => ({ participantId: byName(last).id })),
        },
        presentations: {
          create: data.talks.map((t) => ({
            participantId: byName(t.last).id,
            title: t.title,
            description: t.description,
            durationMinutes: t.minutes,
          })),
        },
      },
    });
    return created;
  }

  const m1 = await meeting({
    number: 1,
    date: "2025-09-18",
    time: "15:00",
    topic: "Організаційне засідання та введення в проєктування БД",
    shortDescription: "Сформовано склад групи, узгоджено напрями досліджень і план семестру.",
    agenda: "1. Мета і завдання групи.\n2. Огляд напрямів.\n3. Розподіл тем.",
    discussion: "Обговорено очікування учасників, формат доповідей і критерії оцінювання дослідницьких завдань.",
    results: "Затверджено план роботи; розподілено теми між учасниками.",
    conclusions: "Група розпочинає цикл засідань із класичного реляційного проєктування.",
    attendees: ["Петренко", "Коваль", "Шевченко", "Павленко", "Бондар", "Лисенко"],
    talks: [
      {
        last: "Павленко",
        title: "Від предметної області до ER-діаграми",
        description: "Кроки виявлення сутностей, атрибутів і зв'язків.",
        minutes: 18,
      },
    ],
  });

  const m2 = await meeting({
    number: 2,
    date: "2025-10-02",
    time: "15:00",
    topic: "Нормалізація реляційних схем",
    shortDescription: "Розглянуто аномалії оновлення та процес нормалізації до BCNF.",
    agenda: "1. Аномалії.\n2. Нормальні форми.\n3. Практикум декомпозиції.",
    discussion: "Учасники розбирали навчальну схему журналу оцінок і шукали порушення 3НФ.",
    results: "Підготовлено набір вправ із нормалізації для молодших курсів.",
    conclusions: "Нормалізація залишається обов'язковим етапом навіть за наявності NoSQL-альтернатив.",
    attendees: ["Петренко", "Шевченко", "Коваль", "Павленко", "Сидоренко", "Савчук"],
    talks: [
      {
        last: "Шевченко",
        title: "Практична декомпозиція до 3НФ і BCNF",
        description: "Приклади функціональних залежностей і втрат інформації.",
        minutes: 22,
      },
    ],
  });

  const m3 = await meeting({
    number: 3,
    date: "2025-10-16",
    time: "15:00",
    topic: "Порівняння SQL та NoSQL",
    shortDescription: "Проаналізовано сценарії, у яких документна модель вигідніша за реляційну.",
    agenda: "1. ACID vs BASE.\n2. Документна модель.\n3. Критерії вибору СКБД.",
    discussion: "Обговорювали інтернет-магазин, журнал подій і систему обліку студентів.",
    results: "Складено порівняльну таблицю SQL/NoSQL для навчальних кейсів.",
    conclusions: "Вибір моделі даних має виходити з патернів доступу, а не з моди.",
    attendees: ["Коваль", "Бондар", "Сидоренко", "Петренко", "Кравчук", "Гончар"],
    talks: [
      {
        last: "Коваль",
        title: "Порівняння SQL та NoSQL",
        description: "Критерії: узгодженість, схема, масштабування, запити.",
        minutes: 20,
      },
      {
        last: "Бондар",
        title: "Коли MongoDB спрощує розробку",
        description: "Гнучка схема для каталогу продукції.",
        minutes: 15,
      },
    ],
  });

  const m4 = await meeting({
    number: 4,
    date: "2026-02-12",
    time: "15:00",
    topic: "Сучасні системи керування базами даних",
    shortDescription: "Огляд PostgreSQL, MySQL і MongoDB з акцентом на навчальні та промислові сценарії.",
    agenda: "1. PostgreSQL.\n2. MySQL.\n3. MongoDB.\n4. SQL і NoSQL — підсумки.",
    discussion: "PostgreSQL; MySQL; MongoDB; SQL та NoSQL. Порівняно типи даних, індекси, реплікацію та екосистему інструментів.",
    results: "Визначено тему наступного дослідження; розподілено завдання; підготовлено матеріали.",
    conclusions: "PostgreSQL обрано базовою СКБД для більшості навчальних проєктів групи.",
    attendees: ["Петренко", "Коваль", "Кравчук", "Бондар", "Лисенко", "Ткаченко", "Романюк"],
    talks: [
      {
        last: "Петренко",
        title: "Особливості PostgreSQL",
        description: "MVCC, JSONB, розширення, індекси GiST/GIN.",
        minutes: 20,
      },
      {
        last: "Коваль",
        title: "Порівняння SQL та NoSQL",
        description: "Оновлений огляд після семестрової практики.",
        minutes: 16,
      },
    ],
  });

  const m5 = await meeting({
    number: 5,
    date: "2026-03-12",
    time: "15:00",
    topic: "Безпека та розмежування доступу в БД",
    shortDescription: "Ролі, політики RLS, аудит і захист від ін'єкцій.",
    agenda: "1. Модель прав.\n2. RLS.\n3. Типові вразливості.",
    discussion: "Розглянули кейс витоку даних через надмірні привілеї додатка.",
    results: "Сформовано чекліст безпеки для студентських проєктів.",
    conclusions: "Принцип найменших привілеїв має бути частиною проєктування, а не «доналагодження».",
    attendees: ["Ткаченко", "Петренко", "Лисенко", "Романюк", "Гончар"],
    talks: [
      {
        last: "Ткаченко",
        title: "Row Level Security у PostgreSQL",
        description: "Політики доступу для багатокористувацьких додатків.",
        minutes: 19,
      },
    ],
  });

  const m6 = await meeting({
    number: 6,
    date: "2026-09-18",
    time: "15:00",
    topic: "Хмарні бази даних і керовані сервіси",
    shortDescription: "Огляд RDS, Cloud SQL, резервного копіювання та вартості володіння.",
    agenda: "1. IaaS vs DBaaS.\n2. SLA і бекапи.\n3. Міграція.",
    discussion: "Порівнювали самостійне адміністрування PostgreSQL і керований інстанс.",
    results: "Обрано хмарний стенд для демонстрацій у новому семестрі.",
    conclusions: "Для навчальних задач керований PostgreSQL знижує операційне навантаження.",
    attendees: ["Романюк", "Петренко", "Мельничук", "Гончар", "Коваль", "Лисенко"],
    talks: [
      {
        last: "Романюк",
        title: "Amazon RDS і Cloud SQL: що варто знати студенту",
        description: "Піринг, параметри, снапшоти, оцінка вартості.",
        minutes: 21,
      },
    ],
  });

  const m7 = await meeting({
    number: 7,
    date: "2026-10-02",
    time: "15:00",
    topic: "Індексація та плани виконання запитів",
    shortDescription: "Практичний розбір EXPLAIN ANALYZE на навчальній базі електронного деканату.",
    agenda: "1. B-Tree, Hash, GIN.\n2. Seq scan vs index scan.\n3. Статистика ANALYZE.",
    discussion: "Учасники оптимізували повільний запит журналу успішності з 1.8 с до 40 мс.",
    results: "Опубліковано методичку з читання планів запитів.",
    conclusions: "Індекс без розуміння запиту може навіть погіршити продуктивність.",
    attendees: ["Лисенко", "Петренко", "Шевченко", "Савчук", "Павленко", "Кравчук"],
    talks: [
      {
        last: "Лисенко",
        title: "Як читати EXPLAIN ANALYZE",
        description: "Вартість, рядки, буфери, паралелізм.",
        minutes: 24,
      },
    ],
  });

  const resultDefs: Array<{
    title: string;
    description: string;
    date: string;
    supervisor: string;
    type: ResultType;
    category: string;
    authors: string[];
  }> = [
    {
      title: "Навчальна схема БД електронного деканату",
      description: "Нормалізована схема обліку студентів, дисциплін, оцінок і викладачів з ER-діаграмою.",
      date: "2025-12-10",
      supervisor: "Н. Я. Савка",
      type: "PROJECT",
      category: "Проєктування",
      authors: ["Павленко", "Шевченко"],
    },
    {
      title: "Порівняльне дослідження PostgreSQL, MySQL і MongoDB",
      description: "Експерименти з CRUD, агрегаціями та простотою схеми на однаковому наборі даних.",
      date: "2026-03-01",
      supervisor: "Н. Я. Савка",
      type: "RESEARCH",
      category: "СКБД",
      authors: ["Петренко", "Коваль", "Кравчук"],
    },
    {
      title: "Презентація «Нормалізація на практиці»",
      description: "Набір слайдів і вправ для студентів 2 курсу.",
      date: "2025-10-20",
      supervisor: "Н. Я. Савка",
      type: "PRESENTATION",
      category: "Нормалізація",
      authors: ["Шевченко"],
    },
    {
      title: "Стаття в збірнику студентської конференції",
      description: "«Вибір моделі даних для університетських інформаційних систем».",
      date: "2026-04-18",
      supervisor: "Н. Я. Савка",
      type: "ARTICLE",
      category: "Конференція",
      authors: ["Коваль", "Бондар"],
    },
    {
      title: "Чекліст безпеки студентських баз даних",
      description: "Практичні рекомендації щодо ролей, паролів, RLS і захисту від SQL-ін'єкцій.",
      date: "2026-03-20",
      supervisor: "Н. Я. Савка",
      type: "DEVELOPMENT",
      category: "Безпека",
      authors: ["Ткаченко"],
    },
    {
      title: "Участь у хакатоні University Data Challenge",
      description: "Команда групи зайняла призове місце з аналітичним сховищем успішності.",
      date: "2026-05-12",
      supervisor: "Н. Я. Савка",
      type: "CONTEST",
      category: "Конкурс",
      authors: ["Лисенко", "Гончар", "Романюк"],
    },
  ];

  const results = [];
  for (const r of resultDefs) {
    results.push(
      await prisma.result.create({
        data: {
          title: r.title,
          description: r.description,
          date: new Date(r.date),
          supervisor: r.supervisor,
          type: r.type,
          category: r.category,
          status: "PUBLISHED",
          authors: { create: r.authors.map((last) => ({ participantId: byName(last).id })) },
        },
      })
    );
  }

  const cats = await Promise.all(
    [
      ["PostgreSQL", "postgresql"],
      ["MySQL", "mysql"],
      ["MongoDB", "mongodb"],
      ["SQL", "sql"],
      ["NoSQL", "nosql"],
      ["Big Data", "big-data"],
      ["Cloud", "cloud"],
      ["AI", "ai"],
      ["Загальні новини", "general"],
    ].map(([name, slug]) => prisma.category.create({ data: { name, slug } }))
  );
  const cat = (slug: string) => cats.find((c) => c.slug === slug)!;

  await prisma.news.createMany({
    data: [
      {
        title: "PostgreSQL 18: що нового для проєктувальників",
        excerpt: "Огляд покращень планувальника, логічної реплікації та роботи з JSON.",
        content:
          "Нова мажорна версія PostgreSQL посилює аналітичні можливості та зручність адміністрування. Для проблемної групи це означає оновлення лабораторного стенду і окреме засідання з розбору реліз-нотів. Особливу увагу приділимо змінам у статистиці планувальника та індексах.",
        date: new Date("2026-10-08"),
        author: "Іван Петренко",
        categoryId: cat("postgresql").id,
        published: true,
      },
      {
        title: "MongoDB Aggregation Pipeline на практиці",
        excerpt: "Як будувати аналітичні запити без SQL і коли це справді доречно.",
        content:
          "Документна модель добре працює, коли структура записів неоднорідна. У матеріалі розбираємо $lookup, $group і підводні камені «джойнів» у MongoDB на прикладі каталогу лабораторних робіт.",
        date: new Date("2026-09-28"),
        author: "Анна Бондар",
        categoryId: cat("mongodb").id,
        published: true,
      },
      {
        title: "Хмарний PostgreSQL: RDS чи самостійний сервер?",
        excerpt: "Коротке порівняння вартості, бекапів і контролю конфігурації.",
        content:
          "Керовані сервіси знімають частину операційного навантаження, але зменшують гнучкість. Для студентських проєктів зазвичай вигідніший DBaaS із нічним вимиканням інстанса.",
        date: new Date("2026-09-20"),
        author: "Наталія Романюк",
        categoryId: cat("cloud").id,
        published: true,
      },
      {
        title: "Векторний пошук: pgvector у навчальних проєктах",
        excerpt: "Як поєднати класичну реляційну схему з ембедингами.",
        content:
          "Штучний інтелект не замінює проєктування БД, а додає новий тип запитів. Розглядаємо зберігання ембедингів поруч із реляційними сутностями та обмеження ANN-індексів.",
        date: new Date("2026-10-01"),
        author: "Катерина Гончар",
        categoryId: cat("ai").id,
        published: true,
      },
      {
        title: "MySQL 8: віконні функції та CTE",
        excerpt: "SQL у MySQL став виразнішим — показуємо типові навчальні запити.",
        content:
          "CTE і віконні функції дозволяють писати аналітичні запити без тимчасових таблиць. Це корисно для звітів успішності та рейтингів студентів.",
        date: new Date("2026-08-30"),
        author: "Андрій Кравчук",
        categoryId: cat("mysql").id,
        published: true,
      },
      {
        title: "Нормалізація vs денормалізація в аналітиці",
        excerpt: "Чому сховища даних свідомо порушують 3НФ і як це обґрунтувати.",
        content:
          "У OLTP нормалізація захищає цілісність. В OLAP денормалізація зменшує кількість з'єднань. Група готує окремий практикум зі зірковою схемою.",
        date: new Date("2026-07-14"),
        author: "Юрій Мельничук",
        categoryId: cat("big-data").id,
        published: true,
      },
      {
        title: "Як не пропустити SQL-ін'єкцію в студентському API",
        excerpt: "Параметризовані запити, ORM і перевірка прав на рівні БД.",
        content:
          "Найчастіша помилка — конкатенація рядків у SQL. Показуємо безпечні патерни для Node.js і PostgreSQL, а також роль RLS.",
        date: new Date("2026-06-05"),
        author: "Софія Ткаченко",
        categoryId: cat("sql").id,
        published: true,
      },
      {
        title: "Коли Redis — це не база даних, а кеш",
        excerpt: "Розмежовуємо ролі key-value сховища в архітектурі додатка.",
        content:
          "NoSQL не завжди означає «замість PostgreSQL». Redis чудово працює як кеш сесій і черг, але не замінює транзакційну модель обліку.",
        date: new Date("2026-05-22"),
        author: "Максим Сидоренко",
        categoryId: cat("nosql").id,
        published: true,
      },
      {
        title: "Новий навчальний рік проблемної групи DataLab",
        excerpt: "Відкрито набір учасників і опубліковано план осіннього семестру.",
        content:
          "Запрошуємо студентів 1–4 курсів, які хочуть глибше зрозуміти проєктування баз даних. Реєстрація — через форму на сайті групи.",
        date: new Date("2026-09-02"),
        author: "Надія Савка",
        categoryId: cat("general").id,
        published: true,
      },
    ],
  });

  await prisma.material.createMany({
    data: [
      {
        title: "Конспект: нормальні форми",
        description: "Короткий довідник 1НФ–BCNF з прикладами українською.",
        type: "PDF",
        category: "Нормалізація",
        author: "Олексій Шевченко",
        date: new Date("2025-10-02"),
        url: "https://www.postgresql.org/docs/current/",
        meetingId: m2.id,
      },
      {
        title: "Презентація: особливості PostgreSQL",
        description: "Слайди до засідання №4.",
        type: "PRESENTATION",
        category: "PostgreSQL",
        author: "Іван Петренко",
        date: new Date("2026-02-12"),
        url: "https://www.postgresql.org/about/",
        meetingId: m4.id,
      },
      {
        title: "SQL-скрипт навчальної БД деканату",
        description: "DDL і тестові дані для лабораторних робіт.",
        type: "SQL",
        category: "Проєктування",
        author: "Ірина Павленко",
        date: new Date("2025-12-10"),
        url: "https://github.com",
        resultId: results[0].id,
      },
      {
        title: "Чекліст безпеки БД",
        description: "PDF-пам'ятка для авторів курсових робіт.",
        type: "DOCUMENT",
        category: "Безпека",
        author: "Софія Ткаченко",
        date: new Date("2026-03-20"),
        url: "https://owasp.org/www-community/attacks/SQL_Injection",
        meetingId: m5.id,
      },
      {
        title: "Відео: читаємо EXPLAIN ANALYZE",
        description: "Запис розбору плану запиту на засіданні №7.",
        type: "VIDEO",
        category: "Оптимізація",
        author: "Дмитро Лисенко",
        date: new Date("2026-10-02"),
        url: "https://www.postgresql.org/docs/current/using-explain.html",
        meetingId: m7.id,
      },
      {
        title: "Офіційна документація MongoDB Aggregation",
        description: "Зовнішнє посилання для самостійного опрацювання.",
        type: "LINK",
        category: "MongoDB",
        author: "Анна Бондар",
        date: new Date("2025-10-16"),
        url: "https://www.mongodb.com/docs/manual/aggregation/",
        meetingId: m3.id,
      },
    ],
  });

  console.log("Seed completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
