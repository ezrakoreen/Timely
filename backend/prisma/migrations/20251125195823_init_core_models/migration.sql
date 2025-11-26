-- CreateTable
CREATE TABLE "UserProfile" (
    "userId" TEXT NOT NULL,
    "defaultBufferMin" INTEGER NOT NULL DEFAULT 5,
    "walkingSpeedFactor" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "campusHomeLabel" TEXT,
    "campusHomeLat" DOUBLE PRECISION,
    "campusHomeLng" DOUBLE PRECISION,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "quietHoursStart" TEXT,
    "quietHoursEnd" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "CalendarSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventsJson" JSONB NOT NULL,
    "calendarSyncId" TEXT,

    CONSTRAINT "CalendarSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalkSegment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "calendarEventId" TEXT NOT NULL,
    "snapshotId" TEXT NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,
    "etaMinutes" INTEGER NOT NULL,
    "bufferMinutes" INTEGER NOT NULL,
    "originLabel" TEXT,
    "originLat" DOUBLE PRECISION NOT NULL,
    "originLng" DOUBLE PRECISION NOT NULL,
    "destinationLabel" TEXT,
    "destinationLat" DOUBLE PRECISION NOT NULL,
    "destinationLng" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalkSegment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalendarSnapshot_userId_capturedAt_idx" ON "CalendarSnapshot"("userId", "capturedAt");

-- CreateIndex
CREATE INDEX "WalkSegment_userId_departureTime_idx" ON "WalkSegment"("userId", "departureTime");

-- CreateIndex
CREATE INDEX "WalkSegment_userId_calendarEventId_idx" ON "WalkSegment"("userId", "calendarEventId");

-- AddForeignKey
ALTER TABLE "CalendarSnapshot" ADD CONSTRAINT "CalendarSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalkSegment" ADD CONSTRAINT "WalkSegment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalkSegment" ADD CONSTRAINT "WalkSegment_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "CalendarSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
