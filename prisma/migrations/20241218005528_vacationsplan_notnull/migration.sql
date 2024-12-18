/*
  Warnings:

  - Made the column `mat` on table `VacationPlan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `optionOne` on table `VacationPlan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `optionTwo` on table `VacationPlan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `VacationPlan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "VacationPlan" ALTER COLUMN "mat" SET NOT NULL,
ALTER COLUMN "optionOne" SET NOT NULL,
ALTER COLUMN "optionTwo" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;
