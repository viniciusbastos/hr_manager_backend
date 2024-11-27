/*
  Warnings:

  - You are about to drop the column `crmId` on the `Sicknote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sicknote" DROP COLUMN "crmId",
ADD COLUMN     "crm" TEXT;
