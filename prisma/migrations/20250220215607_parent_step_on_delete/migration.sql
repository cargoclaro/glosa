-- DropForeignKey
ALTER TABLE "CustomGlossTabValidationStep" DROP CONSTRAINT "CustomGlossTabValidationStep_parentStepId_fkey";

-- AddForeignKey
ALTER TABLE "CustomGlossTabValidationStep" ADD CONSTRAINT "CustomGlossTabValidationStep_parentStepId_fkey" FOREIGN KEY ("parentStepId") REFERENCES "CustomGlossTabValidationStep"("id") ON DELETE CASCADE ON UPDATE CASCADE;
