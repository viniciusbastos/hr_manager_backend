/*
  Warnings:

  - You are about to drop the column `Date_Inicial` on the `SickNote` table. All the data in the column will be lost.
  - You are about to drop the column `Date_final` on the `SickNote` table. All the data in the column will be lost.
  - Added the required column `Cid` to the `SickNote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FinalDate` to the `SickNote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `InitialDate` to the `SickNote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SickNote" DROP COLUMN "Date_Inicial",
DROP COLUMN "Date_final",
ADD COLUMN     "Cid" TEXT NOT NULL,
ADD COLUMN     "FinalDate" DATE NOT NULL,
ADD COLUMN     "InitialDate" DATE NOT NULL;
