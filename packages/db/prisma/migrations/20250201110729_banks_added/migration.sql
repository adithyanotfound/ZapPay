-- CreateTable
CREATE TABLE "AxisBank" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "locked" INTEGER NOT NULL,

    CONSTRAINT "AxisBank_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HDFCBank" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "locked" INTEGER NOT NULL,

    CONSTRAINT "HDFCBank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AxisBank_userId_key" ON "AxisBank"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "HDFCBank_userId_key" ON "HDFCBank"("userId");

-- AddForeignKey
ALTER TABLE "AxisBank" ADD CONSTRAINT "AxisBank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HDFCBank" ADD CONSTRAINT "HDFCBank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
