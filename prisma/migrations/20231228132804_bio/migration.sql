/*
  Warnings:

  - You are about to drop the column `BIO` on the `SickNote` table. All the data in the column will be lost.
  - You are about to drop the column `BIO` on the `Vacation` table. All the data in the column will be lost.
  - Added the required column `bioId` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bioId` to the `SickNote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bioId` to the `Vacation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "bioId" INTEGER NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SickNote" DROP COLUMN "BIO",
ADD COLUMN     "bioId" INTEGER NOT NULL,
ADD COLUMN     "idBIO" TEXT,
ALTER COLUMN "Cid" DROP NOT NULL,
ALTER COLUMN "Obs" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vacation" DROP COLUMN "BIO",
ADD COLUMN     "bioId" INTEGER NOT NULL,
ADD COLUMN     "idBIO" TEXT;

-- CreateTable
CREATE TABLE "Bio" (
    "id" SERIAL NOT NULL,
    "InitialDate" TIMESTAMP(3) NOT NULL,
    "FinalDate" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "progress" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Vacation" ADD CONSTRAINT "Vacation_bioId_fkey" FOREIGN KEY ("bioId") REFERENCES "Bio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SickNote" ADD CONSTRAINT "SickNote_bioId_fkey" FOREIGN KEY ("bioId") REFERENCES "Bio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_bioId_fkey" FOREIGN KEY ("bioId") REFERENCES "Bio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
