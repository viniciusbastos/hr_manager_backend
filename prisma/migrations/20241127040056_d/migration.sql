/*
  Warnings:

  - The `type` column on the `Weapons` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `location` column on the `Weapons` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `caliber` column on the `Weapons` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Weapons` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Weapons" DROP COLUMN "type",
ADD COLUMN     "type" INTEGER,
DROP COLUMN "location",
ADD COLUMN     "location" INTEGER,
DROP COLUMN "caliber",
ADD COLUMN     "caliber" INTEGER,
DROP COLUMN "status",
ADD COLUMN     "status" INTEGER;
