-- DropForeignKey
ALTER TABLE "Course" DROP CONSTRAINT "Course_bioId_fkey";

-- DropForeignKey
ALTER TABLE "SickNote" DROP CONSTRAINT "SickNote_bioId_fkey";

-- DropForeignKey
ALTER TABLE "Vacation" DROP CONSTRAINT "Vacation_bioId_fkey";

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "bioId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SickNote" ALTER COLUMN "bioId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Vacation" ALTER COLUMN "bioId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Vacation" ADD CONSTRAINT "Vacation_bioId_fkey" FOREIGN KEY ("bioId") REFERENCES "Bio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SickNote" ADD CONSTRAINT "SickNote_bioId_fkey" FOREIGN KEY ("bioId") REFERENCES "Bio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_bioId_fkey" FOREIGN KEY ("bioId") REFERENCES "Bio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
