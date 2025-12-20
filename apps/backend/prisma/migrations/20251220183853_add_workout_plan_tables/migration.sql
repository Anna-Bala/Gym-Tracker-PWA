-- CreateTable
CREATE TABLE `workoutPlans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `duration` INTEGER NOT NULL,
    `focusArea` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `workoutPlanExercises` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `workoutPlanId` INTEGER NOT NULL,
    `exerciseApiId` VARCHAR(191) NOT NULL,
    `sets` INTEGER NOT NULL,
    `reps` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `workoutPlans` ADD CONSTRAINT `workoutPlans_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `workoutPlanExercises` ADD CONSTRAINT `workoutPlanExercises_workoutPlanId_fkey` FOREIGN KEY (`workoutPlanId`) REFERENCES `workoutPlans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
