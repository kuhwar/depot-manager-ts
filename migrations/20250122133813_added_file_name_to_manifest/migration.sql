/*
  Warnings:

  - You are about to drop the column `original_file` on the `manifests` table. All the data in the column will be lost.
  - Added the required column `file_content` to the `manifests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_name` to the `manifests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `manifests` DROP COLUMN `original_file`,
    ADD COLUMN `file_content` LONGTEXT NOT NULL,
    ADD COLUMN `file_name` VARCHAR(191) NOT NULL;
