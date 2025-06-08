
export const getCurrentWeek = (): string => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  return startOfWeek.toISOString().split('T')[0];
};

export const formatWeekDisplay = (weekString: string): string => {
  return new Date(weekString).toLocaleDateString();
};
