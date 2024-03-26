/*
  Warnings:

  - Added the required column `Specialities` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "Specialities" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "HealthProfessionals" ADD COLUMN     "Specialities" TEXT[];
