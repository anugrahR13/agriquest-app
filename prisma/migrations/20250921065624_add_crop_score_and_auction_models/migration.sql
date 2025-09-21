-- CreateTable
CREATE TABLE "public"."CropScore" (
    "id" SERIAL NOT NULL,
    "farmId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "reportUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CropScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuctionRequest" (
    "id" SERIAL NOT NULL,
    "farmId" TEXT NOT NULL,
    "cropScoreId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "govtNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuctionRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CropScore" ADD CONSTRAINT "CropScore_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "public"."farm_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuctionRequest" ADD CONSTRAINT "AuctionRequest_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "public"."farm_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuctionRequest" ADD CONSTRAINT "AuctionRequest_cropScoreId_fkey" FOREIGN KEY ("cropScoreId") REFERENCES "public"."CropScore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
