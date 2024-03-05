/*
  Warnings:

  - The primary key for the `Vacation` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Vacation" DROP CONSTRAINT "Vacation_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Vacation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Vacation_id_seq";
