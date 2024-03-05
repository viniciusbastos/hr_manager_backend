/*
  Warnings:

  - Added the required column `posto` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `month` on the `Vacation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "posto" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vacation" DROP COLUMN "month",
ADD COLUMN     "month" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "SickNote" (
    "id" TEXT NOT NULL,
    "Date_Inicial" TIMESTAMP(3) NOT NULL,
    "Date_final" TIMESTAMP(3) NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "belongsToId" TEXT NOT NULL,

    CONSTRAINT "SickNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SickNote" ADD CONSTRAINT "SickNote_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
