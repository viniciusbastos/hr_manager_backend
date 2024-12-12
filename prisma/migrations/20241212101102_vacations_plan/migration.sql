-- CreateTable
CREATE TABLE "VacationPlan" (
    "id" SERIAL NOT NULL,
    "mat" TEXT,
    "optionOne" INTEGER,
    "optionTwo" INTEGER,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VacationPlan_pkey" PRIMARY KEY ("id")
);
