-- AlterTable
ALTER TABLE "Application" ADD COLUMN "resumeId" TEXT;

-- AlterTable
ALTER TABLE "Resume"
ADD COLUMN "bucket" TEXT,
ADD COLUMN "fileName" TEXT,
ADD COLUMN "mimeType" TEXT,
ADD COLUMN "size" INTEGER,
ADD COLUMN "storageKey" TEXT,
ADD COLUMN "type" TEXT NOT NULL DEFAULT 'ORIGINAL',
ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Application"
ADD CONSTRAINT "Application_resumeId_fkey"
FOREIGN KEY ("resumeId")
REFERENCES "Resume"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
