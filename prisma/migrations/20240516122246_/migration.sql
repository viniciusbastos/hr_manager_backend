/*
  Warnings:

  - The `aisp` column on the `Unidades` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Unidades" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
DROP COLUMN "aisp",
ADD COLUMN     "aisp" TEXT[],
ALTER COLUMN "risp" DROP NOT NULL;
