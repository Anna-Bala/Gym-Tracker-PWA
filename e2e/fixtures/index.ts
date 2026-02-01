import { test as baseTest } from "@playwright/test";

import { mockedUser, mockedWorkoutHistoryAI, mockedWorkoutHistoryUser, mockedWorkoutPlanAI, mockedWorkoutPlanUser } from "./mocks";
import { mockRefreshSuccess } from "./auth";
import { mockUser } from "./user";
import { mockWorkoutHistory } from "./workoutHistory";
import { mockWorkoutPlans } from "./workoutPlan";

interface Fixtures {
  mockedAuth: () => void;
  mockedUser: typeof mockedUser;
  mockedWorkoutPlans: (typeof mockedWorkoutPlanUser)[];
  mockedWorkoutHistory: (typeof mockedWorkoutHistoryUser)[];
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
  mockedWorkoutHistory: [
    async ({ page }, use) => {
      await mockWorkoutHistory(page);
      await use([mockedWorkoutHistoryAI, mockedWorkoutHistoryUser]);
    },
    { auto: true },
  ],
});

export { expect } from "@playwright/test";
