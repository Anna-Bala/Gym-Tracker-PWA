import { test as baseTest } from "@playwright/test";

import { mockedOnbaording, mockedUser, mockedUserStatistics, mockedWorkoutHistoryAI, mockedWorkoutHistoryUser, mockedWorkoutPlanAI, mockedWorkoutPlanDetails, mockedWorkoutPlanUser } from "./mocks";
import { mockOnboardingCreationSuccess } from "./onboarding";
import { mockRefreshSuccess } from "./auth";
import { mockUser } from "./user";
import { mockUserStatistics } from "./userStatistics";
import { mockWorkoutHistory } from "./workoutHistory";
import { mockWorkoutPlans, mockWorkoutPlanDetails } from "./workoutPlan";

interface Fixtures {
  mockedAuth: () => void;
  mockDate: () => void;
  mockedOnboarding: typeof mockedOnbaording;
  mockedUser: typeof mockedUser;
  mockedUserStatistics: typeof mockedUserStatistics;
  mockedWorkoutHistory: (typeof mockedWorkoutHistoryUser)[];
  mockedWorkoutPlans: (typeof mockedWorkoutPlanUser)[];
  mockedWorkoutPlanDetails: typeof mockedWorkoutPlanDetails;
}

export const test = baseTest.extend<Fixtures>({
  mockedAuth: [
    async ({ page }, use) => {
      await mockRefreshSuccess(page);
      await use(undefined);
    },
    { auto: true },
  ],
  mockedUser: [
    async ({ page }, use) => {
      await mockUser(page);
      await use(mockedUser);
    },
    { auto: true },
  ],
  mockedWorkoutPlans: [
    async ({ page }, use) => {
      await mockWorkoutPlans(page);
      await use([mockedWorkoutPlanAI, mockedWorkoutPlanUser]);
    },
    { auto: true },
  ],
  mockedWorkoutPlanDetails: [
    async ({ page }, use) => {
      await mockWorkoutPlanDetails(page);
      await use(mockedWorkoutPlanDetails);
    },
    { auto: true },
  ],
  mockedWorkoutHistory: [
    async ({ page }, use) => {
      await mockWorkoutHistory(page);
      await use([mockedWorkoutHistoryAI, mockedWorkoutHistoryUser]);
    },
    { auto: true },
  ],
  mockedUserStatistics: [
    async ({ page }, use) => {
      await mockUserStatistics(page);
      await use(mockedUserStatistics);
    },
    { auto: true },
  ],
  mockedOnboarding: [
    async ({ page }, use) => {
      await mockOnboardingCreationSuccess(page);
      await use(mockedOnbaording);
    },
    { auto: true },
  ],
  mockDate: [
    async ({ page }, use) => {
      const fakeNow = new Date("2026-01-01T10:00:00Z").getTime();

      await page.addInitScript((time) => {
        const OriginalDate = window.Date;
        // @ts-ignore
        window.Date = class extends OriginalDate {
          constructor(...args: any[]) {
            if (args.length === 0) super(time);
            // @ts-ignore
            else super(...args);
          }
          static now() {
            return time;
          }
        };
      }, fakeNow);

      await use(undefined);
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
