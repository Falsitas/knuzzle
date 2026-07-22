/*
  Warnings:

  - You are about to drop the column `voteType` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `rating` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vote"
ADD COLUMN "rating" INTEGER;

UPDATE "Vote"
SET "rating" =
  CASE
    WHEN "voteType" = 'LIKE' THEN 5
    WHEN "voteType" = 'DISLIKE' THEN 1
  END;

ALTER TABLE "Vote"
ALTER COLUMN "rating" SET NOT NULL;

ALTER TABLE "Vote"
DROP COLUMN "voteType";

-- DropEnum
DROP TYPE "VoteType";
