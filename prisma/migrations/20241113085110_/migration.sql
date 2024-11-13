/*
  Warnings:

  - You are about to drop the `ProfileWepons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wepons` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfileWepons" DROP CONSTRAINT "ProfileWepons_belongsToId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileWepons" DROP CONSTRAINT "ProfileWepons_belongsToWeponsId_fkey";

-- DropTable
DROP TABLE "ProfileWepons";

-- DropTable
DROP TABLE "Wepons";

-- CreateTable
CREATE TABLE "Weapons" (
    "id" SERIAL NOT NULL,
    "model" TEXT,
    "type" TEXT,
    "serialNumber" TEXT,
    "location" TEXT,

    CONSTRAINT "Weapons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileWeapons" (
    "id" SERIAL NOT NULL,
    "belongsToId" TEXT NOT NULL,
    "belongsToWeaponsId" INTEGER NOT NULL,
    "InitialDate" DATE NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProfileWeapons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileWeapons" ADD CONSTRAINT "ProfileWeapons_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileWeapons" ADD CONSTRAINT "ProfileWeapons_belongsToWeaponsId_fkey" FOREIGN KEY ("belongsToWeaponsId") REFERENCES "Weapons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
