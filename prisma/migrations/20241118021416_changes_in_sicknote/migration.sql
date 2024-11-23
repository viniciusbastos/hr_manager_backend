/*
  Warnings:

  - You are about to drop the column `FinalDate` on the `Sicknote` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `Sicknote` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Sicknote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sicknote" DROP COLUMN "FinalDate",
DROP COLUMN "month",
DROP COLUMN "year";
