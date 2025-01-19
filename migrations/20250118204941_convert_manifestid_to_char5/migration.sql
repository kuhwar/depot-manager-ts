/*
  Warnings:

  - The primary key for the `manifests` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `manifest_items` DROP FOREIGN KEY `manifest_items_manifest_id_fkey`;

-- DropIndex
DROP INDEX `manifest_items_manifest_id_fkey` ON `manifest_items`;

-- AlterTable
ALTER TABLE `manifest_items` MODIFY `manifest_id` CHAR(5) NOT NULL;

-- AlterTable
ALTER TABLE `manifests` DROP PRIMARY KEY,
    MODIFY `id` CHAR(5) NOT NULL;

-- AddForeignKey
ALTER TABLE `manifest_items` ADD CONSTRAINT `manifest_items_manifest_id_fkey` FOREIGN KEY (`manifest_id`) REFERENCES `manifests`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
