-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_belongsToProffessionalsId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "belongsToProffessionalsId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_belongsToProffessionalsId_fkey" FOREIGN KEY ("belongsToProffessionalsId") REFERENCES "HealthProfessionals"("id") ON DELETE SET NULL ON UPDATE CASCADE;
