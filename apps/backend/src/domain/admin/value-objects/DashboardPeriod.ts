export class DashboardPeriod {
  public readonly months: number;

  constructor(months = 12) {
    if (months < 1 || months > 24) {
      throw new Error('Dashboard period should be between 1 and 24 months');
    }

    this.months = months;
  }
}
