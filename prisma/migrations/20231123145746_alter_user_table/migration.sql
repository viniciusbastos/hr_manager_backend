/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "seviceTime" TEXT,
ADD COLUMN     "workplace" TEXT,
ALTER COLUMN "email" DROP NOT NULL;
