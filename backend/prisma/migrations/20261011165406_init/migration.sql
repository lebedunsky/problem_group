-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('NEW', 'REVIEWING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'DONE', 'POSTPONED');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('PLANNED', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ResultType" AS ENUM ('PROJECT', 'RESEARCH', 'PRESENTATION', 'ARTICLE', 'REPORT', 'DEVELOPMENT', 'CONFERENCE', 'CONTEST', 'OTHER');

-- CreateEnum
CREATE TYPE "ResultStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "MaterialType" AS ENUM ('PDF', 'PRESENTATION', 'DOCUMENT', 'LINK', 'SQL', 'VIDEO', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "name" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "goal" TEXT NOT NULL,
    "tasks" TEXT NOT NULL,
    "activityDirections" TEXT NOT NULL,
    "activityInfo" TEXT NOT NULL,
    "leaderName" TEXT NOT NULL,
    "leaderTitle" TEXT NOT NULL,
    "leaderBio" TEXT NOT NULL,
    "leaderPhotoUrl" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "scheduleNote" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "photoUrl" TEXT,
    "academicGroup" TEXT NOT NULL,
    "course" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistrationRequest" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "academicGroup" TEXT NOT NULL,
    "course" INTEGER NOT NULL,
    "direction" TEXT NOT NULL,
    "about" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistrationRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkPlanItem" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "status" "PlanStatus" NOT NULL DEFAULT 'PLANNED',
    "responsibleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkPlanItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleItem" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "status" "ScheduleStatus" NOT NULL DEFAULT 'PLANNED',
    "responsibleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "agenda" TEXT NOT NULL,
    "discussion" TEXT NOT NULL,
    "results" TEXT NOT NULL,
    "conclusions" TEXT NOT NULL,
    "photoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeetingParticipant" (
    "meetingId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "MeetingParticipant_pkey" PRIMARY KEY ("meetingId","participantId")
);

-- CreateTable
CREATE TABLE "Presentation" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "materialUrl" TEXT,
    "durationMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Presentation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "supervisor" TEXT NOT NULL,
    "type" "ResultType" NOT NULL,
    "category" TEXT NOT NULL,
    "link" TEXT,
    "fileUrl" TEXT,
    "status" "ResultStatus" NOT NULL DEFAULT 'COMPLETED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultAuthor" (
    "resultId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,

    CONSTRAINT "ResultAuthor_pkey" PRIMARY KEY ("resultId","participantId")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "author" TEXT NOT NULL,
    "imageUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "MaterialType" NOT NULL,
    "category" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "fileUrl" TEXT,
    "url" TEXT,
    "meetingId" TEXT,
    "newsId" TEXT,
    "resultId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_number_key" ON "Meeting"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- AddForeignKey
ALTER TABLE "WorkPlanItem" ADD CONSTRAINT "WorkPlanItem_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleItem" ADD CONSTRAINT "ScheduleItem_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "Participant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingParticipant" ADD CONSTRAINT "MeetingParticipant_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingParticipant" ADD CONSTRAINT "MeetingParticipant_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultAuthor" ADD CONSTRAINT "ResultAuthor_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultAuthor" ADD CONSTRAINT "ResultAuthor_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "Participant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE SET NULL ON UPDATE CASCADE;
