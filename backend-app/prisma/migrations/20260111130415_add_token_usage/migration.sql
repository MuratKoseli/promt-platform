-- CreateTable
CREATE TABLE "token_usages" (
    "id" TEXT NOT NULL,
    "promptRunId" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL,
    "outputTokens" INTEGER NOT NULL,
    "totalTokens" INTEGER NOT NULL,
    "costUsd" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "token_usages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "token_usages_promptRunId_key" ON "token_usages"("promptRunId");

-- AddForeignKey
ALTER TABLE "token_usages" ADD CONSTRAINT "token_usages_promptRunId_fkey" FOREIGN KEY ("promptRunId") REFERENCES "prompt_runs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
