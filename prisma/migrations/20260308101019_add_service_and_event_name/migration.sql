-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "eventName" TEXT,
ADD COLUMN     "service" TEXT DEFAULT 'Wedding';

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "eventName" TEXT,
ADD COLUMN     "service" TEXT DEFAULT 'Wedding';
