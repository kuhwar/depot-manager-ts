/*
  Warnings:

  - Made the column `display_name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `display_name` VARCHAR(191) NOT NULL;
