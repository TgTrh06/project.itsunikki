export const sections = ['Today', 'Tasks', 'Habits', 'Workouts', 'Nutrition', 'Review', 'Settings'] as const;
export type Section = (typeof sections)[number];
