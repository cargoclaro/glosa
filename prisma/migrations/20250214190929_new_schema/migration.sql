-- AlterTable
ALTER TABLE "CustomGlossTab" ADD COLUMN     "summary" TEXT;

-- AlterTable
ALTER TABLE "CustomGlossTabContext" ADD COLUMN     "summary" TEXT;

-- AlterTable
ALTER TABLE "CustomGlossTabValidationStep" ADD COLUMN     "fraccion" TEXT,
ADD COLUMN     "parentStepId" INTEGER,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "llmAnalysis" DROP NOT NULL,
ALTER COLUMN "isCorrect" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CustomGlossTabValidationStep" ADD CONSTRAINT "CustomGlossTabValidationStep_parentStepId_fkey" FOREIGN KEY ("parentStepId") REFERENCES "CustomGlossTabValidationStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;
