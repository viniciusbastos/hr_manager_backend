/*
  Warnings:

  - You are about to drop the column `cpf` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `serviceTime` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `workplace` on the `User` table. All the data in the column will be lost.
  - Made the column `adress` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "serviceTime" DATE,
ADD COLUMN     "workplace" TEXT,
ALTER COLUMN "adress" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cpf",
DROP COLUMN "serviceTime",
DROP COLUMN "workplace",
ADD COLUMN     "password" TEXT NOT NULL DEFAULT 123456;
