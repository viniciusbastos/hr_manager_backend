/*
  Warnings:

  - Added the required column `finishAt` to the `Vacation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startAt` to the `Vacation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Vacation` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `month` on the `Vacation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "seviceTime" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vacation" ADD COLUMN     "finishAt" DATE NOT NULL,
ADD COLUMN     "startAt" DATE NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL,
DROP COLUMN "month",
ADD COLUMN     "month" INTEGER NOT NULL;
