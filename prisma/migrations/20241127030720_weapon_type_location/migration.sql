-- CreateTable
CREATE TABLE "WeaponType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeaponType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeaponLocation" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WeaponLocation_pkey" PRIMARY KEY ("id")
);
