/*
  Warnings:

  - Added the required column `restTime` to the `onboarding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calories` to the `workoutHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `workoutHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calories` to the `workoutPlans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `onboarding` ADD COLUMN `restTime` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `workoutHistory` ADD COLUMN `calories` INTEGER NOT NULL,
    ADD COLUMN `duration` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `workoutPlans` ADD COLUMN `calories` INTEGER NOT NULL;
