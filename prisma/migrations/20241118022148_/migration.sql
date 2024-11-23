/*
  Warnings:

  - You are about to drop the column `approved` on the `Sicknote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sicknote" DROP COLUMN "approved",
ADD COLUMN     "DoctorName" TEXT;
