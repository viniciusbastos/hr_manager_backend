/*
  Warnings:

  - The primary key for the `SickNote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SickNote` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "SickNote" DROP CONSTRAINT "SickNote_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "SickNote_pkey" PRIMARY KEY ("id");
