-- AlterTable
CREATE SEQUENCE customglossalert_id_seq;
ALTER TABLE "CustomGlossAlert" ALTER COLUMN "id" SET DEFAULT nextval('customglossalert_id_seq');
ALTER SEQUENCE customglossalert_id_seq OWNED BY "CustomGlossAlert"."id";

-- AlterTable
CREATE SEQUENCE customglosscertification_id_seq;
ALTER TABLE "CustomGlossCertification" ALTER COLUMN "id" SET DEFAULT nextval('customglosscertification_id_seq');
ALTER SEQUENCE customglosscertification_id_seq OWNED BY "CustomGlossCertification"."id";

-- AlterTable
CREATE SEQUENCE customglossdestinationorigin_id_seq;
ALTER TABLE "CustomGlossDestinationOrigin" ALTER COLUMN "id" SET DEFAULT nextval('customglossdestinationorigin_id_seq');
ALTER SEQUENCE customglossdestinationorigin_id_seq OWNED BY "CustomGlossDestinationOrigin"."id";

-- AlterTable
CREATE SEQUENCE customglossfile_id_seq;
ALTER TABLE "CustomGlossFile" ALTER COLUMN "id" SET DEFAULT nextval('customglossfile_id_seq');
ALTER SEQUENCE customglossfile_id_seq OWNED BY "CustomGlossFile"."id";

-- AlterTable
CREATE SEQUENCE customglossgrossweight_id_seq;
ALTER TABLE "CustomGlossGrossWeight" ALTER COLUMN "id" SET DEFAULT nextval('customglossgrossweight_id_seq');
ALTER SEQUENCE customglossgrossweight_id_seq OWNED BY "CustomGlossGrossWeight"."id";

-- AlterTable
CREATE SEQUENCE customglossinvoicedata_id_seq;
ALTER TABLE "CustomGlossInvoiceData" ALTER COLUMN "id" SET DEFAULT nextval('customglossinvoicedata_id_seq');
ALTER SEQUENCE customglossinvoicedata_id_seq OWNED BY "CustomGlossInvoiceData"."id";

-- AlterTable
CREATE SEQUENCE customglossoperation_id_seq;
ALTER TABLE "CustomGlossOperation" ALTER COLUMN "id" SET DEFAULT nextval('customglossoperation_id_seq');
ALTER SEQUENCE customglossoperation_id_seq OWNED BY "CustomGlossOperation"."id";

-- AlterTable
CREATE SEQUENCE customglossoperationtype_id_seq;
ALTER TABLE "CustomGlossOperationType" ALTER COLUMN "id" SET DEFAULT nextval('customglossoperationtype_id_seq');
ALTER SEQUENCE customglossoperationtype_id_seq OWNED BY "CustomGlossOperationType"."id";

-- AlterTable
CREATE SEQUENCE customglosspedimentnum_id_seq;
ALTER TABLE "CustomGlossPedimentNum" ALTER COLUMN "id" SET DEFAULT nextval('customglosspedimentnum_id_seq');
ALTER SEQUENCE customglosspedimentnum_id_seq OWNED BY "CustomGlossPedimentNum"."id";

-- AlterTable
CREATE SEQUENCE customglosstransportdata_id_seq;
ALTER TABLE "CustomGlossTransportData" ALTER COLUMN "id" SET DEFAULT nextval('customglosstransportdata_id_seq');
ALTER SEQUENCE customglosstransportdata_id_seq OWNED BY "CustomGlossTransportData"."id";
