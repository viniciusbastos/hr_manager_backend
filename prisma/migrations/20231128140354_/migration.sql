/*
  Warnings:

  - You are about to alter the column `mat` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Char(8)`.
  - A unique constraint covering the columns `[mat]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "mat" SET DATA TYPE CHAR(8),
ALTER COLUMN "password" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "User_mat_key" ON "User"("mat");
