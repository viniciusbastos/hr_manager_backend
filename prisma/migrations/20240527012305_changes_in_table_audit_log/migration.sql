/*
  Warnings:

  - Added the required column `ipAdress` to the `AuditLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusCode` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "ipAdress" TEXT NOT NULL,
ADD COLUMN     "statusCode" INTEGER NOT NULL;
