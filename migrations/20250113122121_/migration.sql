/*
  Warnings:

  - A unique constraint covering the columns `[walmart_id,depot_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `products_walmart_id_depot_id_key` ON `products`(`walmart_id`, `depot_id`);
