/*
  Warnings:

  - You are about to drop the `SickNote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SickNote" DROP CONSTRAINT "SickNote_belongsToId_fkey";

-- DropForeignKey
ALTER TABLE "SickNote" DROP CONSTRAINT "SickNote_bioId_fkey";

-- DropTable
DROP TABLE "SickNote";

-- CreateTable
CREATE TABLE "Sicknote" (
    "id" SERIAL NOT NULL,
    "InitialDate" TIMESTAMP(3) NOT NULL,
    "FinalDate" TIMESTAMP(3) NOT NULL,
    "Days" INTEGER NOT NULL,
    "Cid" TEXT,
    "Obs" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "belongsToId" TEXT NOT NULL,
    "bioId" INTEGER,

    CONSTRAINT "Sicknote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sicknote" ADD CONSTRAINT "Sicknote_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sicknote" ADD CONSTRAINT "Sicknote_bioId_fkey" FOREIGN KEY ("bioId") REFERENCES "Bio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
