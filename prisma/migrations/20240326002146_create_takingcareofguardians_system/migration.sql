-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "bithDate" DATE;

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "Service" TEXT NOT NULL,
    "progress" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "belongsToId" TEXT NOT NULL,
    "belongsToProffessionalsId" INTEGER NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthProfessionals" (
    "id" SERIAL NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "Service" TEXT NOT NULL,
    "progress" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthProfessionals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_belongsToProffessionalsId_fkey" FOREIGN KEY ("belongsToProffessionalsId") REFERENCES "HealthProfessionals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
