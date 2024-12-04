-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "adress" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Drivers" (
    "id" SERIAL NOT NULL,
    "matricula" TEXT NOT NULL,
    "driverLicense" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "licenseValidity" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Drivers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Drivers_matricula_key" ON "Drivers"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Drivers_driverLicense_key" ON "Drivers"("driverLicense");
