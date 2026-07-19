-- Drop table data
DELETE FROM "IdentityVerificationDocument";

-- AlterTable
ALTER TABLE "IdentityVerificationDocument" ADD COLUMN "userId" TEXT NOT NULL,
ADD COLUMN "documentType" TEXT NOT NULL DEFAULT 'Identity',
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pending';

-- AddForeignKey
ALTER TABLE "IdentityVerificationDocument" ADD CONSTRAINT "IdentityVerificationDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
