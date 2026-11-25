// Overtime rule sets. stateMinWage for NV must come from data/states.json (verified) before NV is offered.
export const RULES = {
  FED: { weeklyOT: 40 },
  CA:  { weeklyOT: 40, dailyOT: 8, dailyDT: 12, seventhDay: true }, // alternative workweeks not modelled
  AK:  { weeklyOT: 40, dailyOT: 8 },                                 // employers with 4+ employees
  NV:  { weeklyOT: 40, dailyOT: 8, dailyOTRateCapMultiple: 1.5, stateMinWage: null }, // VERIFY + fill from data
  CO:  { weeklyOT: 40, dailyOT: 12 },                                // also >12 consecutive hours (not modelled)
};
