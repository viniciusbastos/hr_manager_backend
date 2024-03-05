/*
  Warnings:

  - Added the required column `seviceTime` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "seviceTime",
ADD COLUMN     "seviceTime" DATE NOT NULL;
