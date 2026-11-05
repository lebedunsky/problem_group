export type Participant = {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
  academicGroup: string;
  course: number;
  role: string;
  direction: string;
  bio: string;
  email?: string | null;
};

export type GroupSettings = {
  id: string;
  name: string;
  topic: string;
  shortDescription: string;
  description: string;
  goal: string;
  tasks: string;
  activityDirections: string;
  activityInfo: string;
  leaderName: string;
  leaderTitle: string;
  leaderBio: string;
  leaderPhotoUrl?: string | null;
  email: string;
  phone: string;
  address: string;
  scheduleNote: string;
};

export type Stats = {
  participants: number;
  meetings: number;
  results: number;
  materials: number;
  news: number;
};

export type ScheduleItem = {
  id: string;
  date: string;
  time: string;
  location: string;
  topic: string;
  status: string;
  responsible?: Participant | null;
  responsibleId?: string | null;
};

export type WorkPlanItem = {
  id: string;
  date: string;
  title: string;
  description: string;
  workType: string;
  status: string;
  responsible?: Participant | null;
  responsibleId?: string | null;
};

export type Presentation = {
  id?: string;
  participantId: string;
  participant?: Participant;
  title: string;
  description: string;
  materialUrl?: string | null;
  durationMinutes: number;
};

export type Meeting = {
  id: string;
  number: number;
  date: string;
  time: string;
  topic: string;
  shortDescription: string;
  agenda: string;
  discussion: string;
  results: string;
  conclusions: string;
  photoUrl?: string | null;
  participants: { participant: Participant }[];
  presentations: Presentation[];
  materials?: Material[];
};

export type ResultItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  supervisor: string;
  type: string;
  category: string;
  link?: string | null;
  fileUrl?: string | null;
  status: string;
  authors: { participant: Participant }[];
};

export type Category = { id: string; name: string; slug: string };

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  imageUrl?: string | null;
  published: boolean;
  categoryId: string;
  category: Category;
};

export type Material = {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  author: string;
  date: string;
  fileUrl?: string | null;
  url?: string | null;
};

export type RegistrationRequest = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  academicGroup: string;
  course: number;
  direction: string;
  about: string;
  motivation: string;
  status: string;
  createdAt: string;
};
