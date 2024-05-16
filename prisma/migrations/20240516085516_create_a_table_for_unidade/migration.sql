/*
  Warnings:

  - You are about to drop the `book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `clipping` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "clipping" DROP CONSTRAINT "clipping_book_id_fkey";

-- DropTable
DROP TABLE "book";

-- DropTable
DROP TABLE "clipping";

-- CreateTable
CREATE TABLE "Unidades" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "cidades" TEXT[],
    "aisp" TEXT NOT NULL,
    "risp" TEXT NOT NULL,

    CONSTRAINT "Unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileUnidade" (
    "id" SERIAL NOT NULL,
    "belongsToId" TEXT NOT NULL,
    "belongsToUnidadeId" INTEGER NOT NULL,

    CONSTRAINT "ProfileUnidade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileUnidade" ADD CONSTRAINT "ProfileUnidade_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileUnidade" ADD CONSTRAINT "ProfileUnidade_belongsToUnidadeId_fkey" FOREIGN KEY ("belongsToUnidadeId") REFERENCES "Unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
