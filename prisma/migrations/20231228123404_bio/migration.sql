/*
  Warnings:

  - Added the required column `BIO` to the `SickNote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `BIO` to the `Vacation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SickNote" ADD COLUMN     "BIO" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vacation" ADD COLUMN     "BIO" TEXT NOT NULL;
