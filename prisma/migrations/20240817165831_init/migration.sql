-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "userType" TEXT DEFAULT 'Client';

-- AlterTable
ALTER TABLE "Consultant" ADD COLUMN     "userType" TEXT DEFAULT 'Consultant';
