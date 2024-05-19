/*
  Warnings:

  - The primary key for the `Bio` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_bioId_fkey";

-- DropForeignKey
ALTER TABLE "Sicknote" DROP CONSTRAINT "Sicknote_bioId_fkey";

-- DropForeignKey
ALTER TABLE "Vacation" DROP CONSTRAINT "Vacation_bioId_fkey";

-- AlterTable
ALTER TABLE "Bio" DROP CONSTRAINT "Bio_pkey",
ADD COLUMN     "Month" INTEGER,
ADD COLUMN     "Number" INTEGER,
ADD COLUMN     "Year" INTEGER,
ADD COLUMN     "type" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Bio_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Bio_id_seq";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "bioId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Sicknote" ADD COLUMN     "month" INTEGER,
ADD COLUMN     "year" INTEGER,
ALTER COLUMN "Days" DROP NOT NULL,
ALTER COLUMN "bioId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Vacation" ALTER COLUMN "bioId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Vacation" ADD CONSTRAINT "Vacation_bioId_fkey" FOREIGN KEY ("bioId") REFERENCES "Bio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sicknote" ADD CONSTRAINT "Sicknote_bioId_fkey" FOREIGN KEY ("bioId") REFERENCES "Bio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_bioId_fkey" FOREIGN KEY ("bioId") REFERENCES "Bio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
