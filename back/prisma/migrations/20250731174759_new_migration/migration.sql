/*
  Warnings:

  - You are about to drop the `Ambiente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Demografia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Economia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Indicador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pais` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Saude` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tecnologia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ambiente" DROP CONSTRAINT "Ambiente_indicadorId_fkey";

-- DropForeignKey
ALTER TABLE "Ambiente" DROP CONSTRAINT "Ambiente_paisId_fkey";

-- DropForeignKey
ALTER TABLE "Demografia" DROP CONSTRAINT "Demografia_indicadorId_fkey";

-- DropForeignKey
ALTER TABLE "Demografia" DROP CONSTRAINT "Demografia_paisId_fkey";

-- DropForeignKey
ALTER TABLE "Economia" DROP CONSTRAINT "Economia_indicadorId_fkey";

-- DropForeignKey
ALTER TABLE "Economia" DROP CONSTRAINT "Economia_paisId_fkey";

-- DropForeignKey
ALTER TABLE "Saude" DROP CONSTRAINT "Saude_indicadorId_fkey";

-- DropForeignKey
ALTER TABLE "Saude" DROP CONSTRAINT "Saude_paisId_fkey";

-- DropForeignKey
ALTER TABLE "Tecnologia" DROP CONSTRAINT "Tecnologia_indicadorId_fkey";

-- DropForeignKey
ALTER TABLE "Tecnologia" DROP CONSTRAINT "Tecnologia_paisId_fkey";

-- DropTable
DROP TABLE "Ambiente";

-- DropTable
DROP TABLE "Demografia";

-- DropTable
DROP TABLE "Economia";

-- DropTable
DROP TABLE "Indicador";

-- DropTable
DROP TABLE "Pais";

-- DropTable
DROP TABLE "Saude";

-- DropTable
DROP TABLE "Tecnologia";

-- CreateTable
CREATE TABLE "pais" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "iso3" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicador" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "categoria" "Categoria" NOT NULL,

    CONSTRAINT "indicador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saude" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "ano" INTEGER NOT NULL,
    "paisId" TEXT NOT NULL,
    "indicadorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saude_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "economia" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "ano" INTEGER NOT NULL,
    "paisId" TEXT NOT NULL,
    "indicadorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "economia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ambiente" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "ano" INTEGER NOT NULL,
    "paisId" TEXT NOT NULL,
    "indicadorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ambiente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tecnologia" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "ano" INTEGER NOT NULL,
    "paisId" TEXT NOT NULL,
    "indicadorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tecnologia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demografia" (
    "id" SERIAL NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "ano" INTEGER NOT NULL,
    "paisId" TEXT NOT NULL,
    "indicadorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "demografia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pais_iso3_key" ON "pais"("iso3");

-- CreateIndex
CREATE INDEX "saude_paisId_idx" ON "saude"("paisId");

-- CreateIndex
CREATE INDEX "saude_indicadorId_idx" ON "saude"("indicadorId");

-- CreateIndex
CREATE UNIQUE INDEX "saude_paisId_indicadorId_ano_key" ON "saude"("paisId", "indicadorId", "ano");

-- CreateIndex
CREATE INDEX "economia_paisId_idx" ON "economia"("paisId");

-- CreateIndex
CREATE INDEX "economia_indicadorId_idx" ON "economia"("indicadorId");

-- CreateIndex
CREATE UNIQUE INDEX "economia_paisId_indicadorId_ano_key" ON "economia"("paisId", "indicadorId", "ano");

-- CreateIndex
CREATE INDEX "ambiente_paisId_idx" ON "ambiente"("paisId");

-- CreateIndex
CREATE INDEX "ambiente_indicadorId_idx" ON "ambiente"("indicadorId");

-- CreateIndex
CREATE UNIQUE INDEX "ambiente_paisId_indicadorId_ano_key" ON "ambiente"("paisId", "indicadorId", "ano");

-- CreateIndex
CREATE INDEX "tecnologia_paisId_idx" ON "tecnologia"("paisId");

-- CreateIndex
CREATE INDEX "tecnologia_indicadorId_idx" ON "tecnologia"("indicadorId");

-- CreateIndex
CREATE UNIQUE INDEX "tecnologia_paisId_indicadorId_ano_key" ON "tecnologia"("paisId", "indicadorId", "ano");

-- CreateIndex
CREATE INDEX "demografia_paisId_idx" ON "demografia"("paisId");

-- CreateIndex
CREATE INDEX "demografia_indicadorId_idx" ON "demografia"("indicadorId");

-- CreateIndex
CREATE UNIQUE INDEX "demografia_paisId_indicadorId_ano_key" ON "demografia"("paisId", "indicadorId", "ano");

-- AddForeignKey
ALTER TABLE "saude" ADD CONSTRAINT "saude_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saude" ADD CONSTRAINT "saude_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "economia" ADD CONSTRAINT "economia_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "economia" ADD CONSTRAINT "economia_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambiente" ADD CONSTRAINT "ambiente_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ambiente" ADD CONSTRAINT "ambiente_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tecnologia" ADD CONSTRAINT "tecnologia_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tecnologia" ADD CONSTRAINT "tecnologia_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demografia" ADD CONSTRAINT "demografia_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "pais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demografia" ADD CONSTRAINT "demografia_indicadorId_fkey" FOREIGN KEY ("indicadorId") REFERENCES "indicador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
