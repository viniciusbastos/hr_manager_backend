/*
  Warnings:

  - Added the required column `pelotao` to the `VacationPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VacationPlan" ADD COLUMN     "pelotao" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Posto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Posto_pkey" PRIMARY KEY ("id")
);
