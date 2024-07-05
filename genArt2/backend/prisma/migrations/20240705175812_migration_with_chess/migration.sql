-- CreateTable
CREATE TABLE "Warnsdorff" (
    "id" TEXT NOT NULL,
    "boardSize" INTEGER NOT NULL,
    "path" INTEGER[],
    "gigerMode" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "Warnsdorff_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Warnsdorff" ADD CONSTRAINT "Warnsdorff_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
