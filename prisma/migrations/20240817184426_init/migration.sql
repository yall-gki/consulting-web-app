-- AlterTable
ALTER TABLE "Request" ALTER COLUMN "duration" DROP DEFAULT,
ALTER COLUMN "duration" SET DATA TYPE TEXT;
