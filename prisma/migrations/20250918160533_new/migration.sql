/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Bio` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `HealthProfessionals` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `belongsToAmmunitionId` on the `ProfileWeapons` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Profileunidade` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Profileunidade` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Unidades` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Unidades` table. All the data in the column will be lost.
  - You are about to drop the column `Workplace` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `digit` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pelotao` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `WeaponCaliber` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `WeaponLocation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `WeaponStatus` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `WeaponType` table. All the data in the column will be lost.
  - You are about to drop the `Ammunition` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Appointment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FuelSupply` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Posto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UploadedFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vehicle` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `adress` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_belongsToId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_belongsToProffessionalsId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileWeapons" DROP CONSTRAINT "ProfileWeapons_belongsToAmmunitionId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileWeapons" DROP CONSTRAINT "ProfileWeapons_belongsToWeaponsId_fkey";

-- AlterTable
ALTER TABLE "AuditLog" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Bio" DROP COLUMN "updatedAt",
ALTER COLUMN "id" SET DEFAULT 'nextval(''"Bio_id_seq"''::regclass)';

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "HealthProfessionals" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "adress" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProfileWeapons" DROP COLUMN "belongsToAmmunitionId",
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Profileunidade" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Unidades" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Workplace",
DROP COLUMN "digit",
DROP COLUMN "pelotao",
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "VacationPlan" ALTER COLUMN "mat" DROP NOT NULL,
ALTER COLUMN "optionOne" DROP NOT NULL,
ALTER COLUMN "optionTwo" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WeaponBrand" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WeaponCaliber" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "WeaponLocation" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "WeaponStatus" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "WeaponType" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Weapons" ALTER COLUMN "updatedAt" DROP NOT NULL;

-- DropTable
DROP TABLE "Ammunition";

-- DropTable
DROP TABLE "Appointment";

-- DropTable
DROP TABLE "FuelSupply";

-- DropTable
DROP TABLE "Posto";

-- DropTable
DROP TABLE "UploadedFile";

-- DropTable
DROP TABLE "Vehicle";
