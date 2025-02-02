/*
  Warnings:

  - You are about to drop the column `item_id` on the `manifest_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[manifest_item_id]` on the table `items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `manifest_items` DROP FOREIGN KEY `manifest_items_item_id_fkey`;

-- DropIndex
DROP INDEX `manifest_items_item_id_key` ON `manifest_items`;

-- AlterTable
ALTER TABLE `items` ADD COLUMN `manifest_item_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `manifest_items` DROP COLUMN `item_id`;

-- CreateIndex
CREATE UNIQUE INDEX `items_manifest_item_id_key` ON `items`(`manifest_item_id`);

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_manifest_item_id_fkey` FOREIGN KEY (`manifest_item_id`) REFERENCES `manifest_items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
