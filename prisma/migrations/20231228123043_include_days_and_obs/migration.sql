/*
  Warnings:

  - Added the required column `Days` to the `SickNote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Obs` to the `SickNote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SickNote" ADD COLUMN     "Days" INTEGER NOT NULL,
ADD COLUMN     "Obs" TEXT NOT NULL,
ALTER COLUMN "FinalDate" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "InitialDate" SET DATA TYPE TIMESTAMP(3);
