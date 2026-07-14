-- CreateTable
CREATE TABLE "SongRequiredPart" (
    "id" SERIAL NOT NULL,
    "songId" INTEGER NOT NULL,
    "session" "Session" NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "SongRequiredPart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SongRequiredPart_songId_session_key" ON "SongRequiredPart"("songId", "session");

-- AddForeignKey
ALTER TABLE "SongRequiredPart" ADD CONSTRAINT "SongRequiredPart_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
