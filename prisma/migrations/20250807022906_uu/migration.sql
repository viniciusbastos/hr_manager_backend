/*
  Warnings:

  - Added the required column `belongsToAmmunitionId` to the `ProfileWeapons` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProfileWeapons" ADD COLUMN     "belongsToAmmunitionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "Workplace" TEXT,
ADD COLUMN     "digit" TEXT,
ADD COLUMN     "pelotao" TEXT;

-- CreateTable
CREATE TABLE "Ammunition" (
    "id" SERIAL NOT NULL,
    "caliber" TEXT,
    "quantity" INTEGER,
    "lote" TEXT,
    "localization" TEXT,
    "expiration" TIMESTAMP(3),
    "status" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ammunition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileWeapons" ADD CONSTRAINT "ProfileWeapons_belongsToAmmunitionId_fkey" FOREIGN KEY ("belongsToAmmunitionId") REFERENCES "Ammunition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
