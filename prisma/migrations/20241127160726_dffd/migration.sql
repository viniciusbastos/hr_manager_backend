/*
  Warnings:

  - The values [OPERACIONAL,MANUTENCAO] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('EM_CONDICOES_DE_USO', 'DEFEITO', 'EM_MANUTENCAO', 'INSERVIVEL', 'DESTRUIDO', 'DEVOLVIDO_AO_DAL', 'EM_USO', 'EM_REPARO', 'EM_TRANSPORTE', 'EM_ARMAZENAMENTO__NO_PAIOL', 'EM_TESTE_DE_MANUTENCAO', 'EM_INSTRUCAO', 'NAO_LOCALIZADA', 'EM_PERICIA', 'A_DISPOSICAO_DA_JUSTICA');
ALTER TABLE "WeaponStatus" ALTER COLUMN "Status" DROP DEFAULT;
ALTER TABLE "WeaponStatus" ALTER COLUMN "Status" TYPE "Status_new" USING ("Status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "WeaponStatus" ALTER COLUMN "Status" SET DEFAULT 'EM_CONDICOES_DE_USO';
COMMIT;

-- AlterTable
ALTER TABLE "WeaponStatus" ALTER COLUMN "Status" SET DEFAULT 'EM_CONDICOES_DE_USO';
