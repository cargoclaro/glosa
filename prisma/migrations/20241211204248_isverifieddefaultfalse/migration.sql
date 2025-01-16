-- AlterTable
ALTER TABLE "CustomGlossCertification" ALTER COLUMN "isVerified" SET DEFAULT false;

-- AlterTable
ALTER TABLE "CustomGlossDestinationOrigin" ALTER COLUMN "isVerified" SET DEFAULT false;

-- AlterTable
ALTER TABLE "CustomGlossGrossWeight" ALTER COLUMN "isVerified" SET DEFAULT false;

-- AlterTable
ALTER TABLE "CustomGlossInvoiceData" ALTER COLUMN "isVerified" SET DEFAULT false;

-- AlterTable
ALTER TABLE "CustomGlossOperation" ALTER COLUMN "isVerified" SET DEFAULT false;

-- AlterTable
ALTER TABLE "CustomGlossOperationType" ALTER COLUMN "isVerified" SET DEFAULT false;

-- AlterTable
ALTER TABLE "CustomGlossPedimentNum" ALTER COLUMN "isVerified" SET DEFAULT false;

-- AlterTable
ALTER TABLE "CustomGlossTransportData" ALTER COLUMN "isVerified" SET DEFAULT false;
