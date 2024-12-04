/*
  Warnings:

  - You are about to drop the column `valid` on the `ProfileWeapons` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProfileWeapons" DROP COLUMN "valid",
ADD COLUMN     "discharge" BOOLEAN NOT NULL DEFAULT false;
