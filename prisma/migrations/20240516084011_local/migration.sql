-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "book" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "authors" TEXT,
    "cover_image" TEXT,
    "note" TEXT,
    "state" INTEGER,
    "source" INTEGER,
    "raw" TEXT,
    "json" TEXT,

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clipping" (
    "id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "start_location" BIGINT,
    "length" BIGINT,
    "date" BIGINT,
    "modified_date" TEXT,
    "content" TEXT,
    "type" TEXT,
    "state" BIGINT,
    "source" BIGINT,
    "raw" TEXT,

    CONSTRAINT "clipping_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "clipping" ADD CONSTRAINT "clipping_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
