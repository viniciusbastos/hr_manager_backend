/*
  Warnings:

  - You are about to drop the `ProfileUnidade` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfileUnidade" DROP CONSTRAINT "ProfileUnidade_belongsToId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileUnidade" DROP CONSTRAINT "ProfileUnidade_belongsToUnidadeId_fkey";

-- DropTable
DROP TABLE "ProfileUnidade";

-- CreateTable
CREATE TABLE "Profileunidade" (
    "id" SERIAL NOT NULL,
    "belongsToId" TEXT NOT NULL,
    "belongsToUnidadeId" INTEGER NOT NULL,

    CONSTRAINT "Profileunidade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Profileunidade" ADD CONSTRAINT "Profileunidade_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profileunidade" ADD CONSTRAINT "Profileunidade_belongsToUnidadeId_fkey" FOREIGN KEY ("belongsToUnidadeId") REFERENCES "Unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
