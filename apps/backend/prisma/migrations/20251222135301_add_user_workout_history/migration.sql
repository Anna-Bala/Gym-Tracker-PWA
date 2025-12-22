/*
  Warnings:

  - Added the required column `days` to the `workoutPlans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `workoutPlans` ADD COLUMN `days` JSON NOT NULL;

-- CreateTable
CREATE TABLE `workoutHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `workoutPlanId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `workoutHistory` ADD CONSTRAINT `workoutHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workoutHistory` ADD CONSTRAINT `workoutHistory_workoutPlanId_fkey` FOREIGN KEY (`workoutPlanId`) REFERENCES `workoutPlans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
