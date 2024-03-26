/*
  Warnings:

  - You are about to drop the column `Date` on the `HealthProfessionals` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `HealthProfessionals` table. All the data in the column will be lost.
  - Added the required column `BirthDate` to the `HealthProfessionals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Name` to the `HealthProfessionals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "Date" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Bio" ALTER COLUMN "InitialDate" SET DATA TYPE DATE,
ALTER COLUMN "FinalDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "HealthProfessionals" DROP COLUMN "Date",
DROP COLUMN "progress",
ADD COLUMN     "BirthDate" DATE NOT NULL,
ADD COLUMN     "Name" TEXT NOT NULL;
