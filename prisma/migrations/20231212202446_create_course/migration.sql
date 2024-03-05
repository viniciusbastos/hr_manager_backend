-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "InitialDate" DATE NOT NULL,
    "FinalDate" DATE NOT NULL,
    "name" TEXT NOT NULL,
    "progress" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "belongsToId" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
