-- CreateTable
CREATE TABLE "Wepons" (
    "id" SERIAL NOT NULL,
    "model" TEXT,
    "type" TEXT,
    "serialNumber" TEXT,
    "location" TEXT,

    CONSTRAINT "Wepons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileWepons" (
    "id" SERIAL NOT NULL,
    "belongsToId" TEXT NOT NULL,
    "belongsToWeponsId" INTEGER NOT NULL,

    CONSTRAINT "ProfileWepons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileWepons" ADD CONSTRAINT "ProfileWepons_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileWepons" ADD CONSTRAINT "ProfileWepons_belongsToWeponsId_fkey" FOREIGN KEY ("belongsToWeponsId") REFERENCES "Wepons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
