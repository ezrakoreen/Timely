/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name";

-- DropTable
DROP TABLE "public"."Event";

-- CreateTable
CREATE TABLE "EventSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalkSegment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT,
    "origin" TEXT,
    "destination" TEXT,
    "googleEtaMin" INTEGER NOT NULL,
    "plannedDepartAt" TIMESTAMP(3),
    "actualDepartAt" TIMESTAMP(3) NOT NULL,
    "arriveAt" TIMESTAMP(3),
    "actualDurationMin" INTEGER,
    "paceFactor" DOUBLE PRECISION,
    "gpsSamples" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalkSegment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventSnapshot" ADD CONSTRAINT "EventSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalkSegment" ADD CONSTRAINT "WalkSegment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalkSegment" ADD CONSTRAINT "WalkSegment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "EventSnapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
