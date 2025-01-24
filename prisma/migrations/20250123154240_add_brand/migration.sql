-- AlterTable
ALTER TABLE "Sicknote" ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "Weapons" ADD COLUMN     "brand" INTEGER;

-- CreateTable
CREATE TABLE "WeaponBrand" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeaponBrand_pkey" PRIMARY KEY ("id")
);
