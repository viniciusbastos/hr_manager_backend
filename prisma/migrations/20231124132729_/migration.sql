/*
  Warnings:

  - You are about to drop the column `seviceTime` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "state" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "seviceTime",
ADD COLUMN     "serviceTime" DATE;
