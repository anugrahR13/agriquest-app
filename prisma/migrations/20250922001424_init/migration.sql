-- CreateTable
CREATE TABLE "public"."auctions" (
    "id" SERIAL NOT NULL,
    "farmId" TEXT NOT NULL,
    "cropScoreId" INTEGER NOT NULL,
    "cropType" TEXT NOT NULL,
    "variety" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL,
    "startingPrice" DOUBLE PRECISION NOT NULL,
    "currentBid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "farmerName" TEXT NOT NULL,
    "farmLocation" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "cropScore" DOUBLE PRECISION NOT NULL,
    "reportUrl" TEXT,
    "govtNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auctions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bids" (
    "id" SERIAL NOT NULL,
    "auctionId" INTEGER NOT NULL,
    "bidderId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "isWinner" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bids_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."auctions" ADD CONSTRAINT "auctions_farmId_fkey" FOREIGN KEY ("farmId") REFERENCES "public"."farm_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."auctions" ADD CONSTRAINT "auctions_cropScoreId_fkey" FOREIGN KEY ("cropScoreId") REFERENCES "public"."CropScore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bids" ADD CONSTRAINT "bids_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "public"."auctions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bids" ADD CONSTRAINT "bids_bidderId_fkey" FOREIGN KEY ("bidderId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
