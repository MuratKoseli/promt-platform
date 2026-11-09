-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "prompt_runs" ADD COLUMN     "status" "RunStatus" NOT NULL DEFAULT 'PENDING';
