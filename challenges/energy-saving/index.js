/* The maximum number of minutes in a period (a day) */
const MAX_IN_PERIOD = 1440;

/**
 *  Description: Below are all the possible state transitions:
 *
 *  I: on -> off
 *  Since we are only concerned with energy usage, then the only state transition
 *  that directly contributes to the usage is the time between on and off.
 *
 *  II: off -> on
 *  While this does not directly contribute to the usage metric, we must
 *  take note of this state change because this is a possible starting point
 *  of our subsequent usage count.
 *
 *  III: on -> on && off -> off
 *  We must take care NOT to change either the state or timestamp as these are
 *  duplicate events.
 */
const calculateEnergyUsageSimple = (profile, day = 1) => {
  const { initial, events } = profile;

  let previousState = initial;
  let previousTs = (day - 1) * MAX_IN_PERIOD;
  let energyUsage = 0;

  for (const event of events) {
    const { timestamp: currentTs, state: currentState } = event;

    if (previousState === currentState) continue;

    if (previousState === "on" && currentState === "off") {
      energyUsage += currentTs - previousTs;
    }

    previousState = currentState;
    previousTs = currentTs;
  }

  // By this point we have exhausted all the events. BUT the last event could
  // have been left in the 'on' state which means we must take into account the
  // time from that last 'on' state to the end of the day
  const MAX_TS = MAX_IN_PERIOD * day;
  if (previousState === "on") energyUsage += MAX_TS - previousTs;
  return energyUsage;
};

/**
 *
 * Description: Same logic as energy usage above, but the difference here is
 * that now we take note of the state change from: auto-off -> on.
 *
 * We also modify our rendundancy check to include the state changes:
 * 1) auto-off -> off
 * 2) off -> auto-off
 *
 */
const calculateEnergySavings = (profile) => {
  const { initial, events } = profile;

  let previousState = initial;
  let previousTs = 0;
  let energySavings = 0;

  for (const event of events) {
    const { timestamp: currentTs, state: currentState } = event;

    if (
      previousState === currentState ||
      (previousState === "auto-off" && currentState === "off") ||
      (previousState === "off" && currentState === "auto-off")
    )
      continue;

    if (previousState === "auto-off" && currentState === "on") {
      energySavings += currentTs - previousTs;
    }
    previousState = currentState;
    previousTs = currentTs;
  }

  if (previousState === "auto-off") energySavings += MAX_IN_PERIOD - previousTs;
  return energySavings;
};

const isInteger = (number) => Number.isInteger(number);

const dataValidation = (day) => {
  if (!isInteger(day)) throw "must be an integer";
  if (day < 1 || day > 365) throw "day out of range";
};

/**
 *
 * @param {string}                  initial Initial state when calculateEnergyUsageForDay is called.
 * @param {array_of_event_objects}  events  Array of events for the year, timestamp in minutes.
 * @returns
 */
const buildCache = (initial, events) => {
  const dayUsageHash = {};
  for (let i = 0; i < events.length; i++) {
    const { timestamp } = events[i];
    const dayIndex = Math.ceil(timestamp / MAX_IN_PERIOD);

    if (!dayUsageHash[dayIndex]) {
      dayUsageHash[dayIndex] = {
        initial: events[i - 1] ? events[i - 1].state : initial,
        events: [events[i]],
      };
    } else {
      dayUsageHash[dayIndex].events.push(events[i]);
    }
  }
  return dayUsageHash;
};

/**
 * Description: We call this function when the day parameter passed does not have any data.
 * This means that the initial state for this day is not supplied so we will have
 * to look for the most recent day prior to this day that has data. That most recent
 * day must also have events, and the last event of that most recent day will be our
 * current day's initial state.
 *
 * @param {int}     day         This is the day whose initial state we are trying to identify.
 * @param {object}  daysInYear  Hash map of days in the year with events data.
 * @param {string}  initial     Initial state when calculateEnergyUsageForDay is called.
 * @returns
 */
const getLatestState = (day, daysInYear, initial) => {
  let mostRecent = day;
  while (
    (!daysInYear[mostRecent] && mostRecent > 0) || // Data for this day does not exist
    (daysInYear[mostRecent] && daysInYear[mostRecent].events.length === 0) // Day does exist but no events
  )
    mostRecent--;

  let latestState = initial;
  const mostRecentDay = daysInYear[mostRecent];
  if (mostRecentDay && mostRecentDay.events.length > 0) {
    // Get state of last event of the most recent previous day
    const lastEvent = mostRecentDay.events.length - 1;
    latestState = mostRecentDay.events[lastEvent].state;
  }
  return latestState;
};

let dataCache = "";
let daysInYear = {};
const calculateEnergyUsageForDay = (monthUsageProfile, day) => {
  dataValidation(day);

  const { initial, events } = monthUsageProfile;
  if (events.length === 0) return initial === "on" ? MAX_IN_PERIOD : 0;

  // Check data cache
  if (dataCache !== JSON.stringify(monthUsageProfile)) {
    dataCache = JSON.stringify(monthUsageProfile);
    daysInYear = buildCache(initial, events);
  }

  if (daysInYear[day]) return calculateEnergyUsageSimple(daysInYear[day], day);
  else {
    const latestState = getLatestState(day, daysInYear, initial);
    return calculateEnergyUsageSimple(
      { initial: latestState, events: [] },
      day
    );
  }
};

module.exports = {
  calculateEnergyUsageSimple,
  calculateEnergySavings,
  calculateEnergyUsageForDay,
  MAX_IN_PERIOD,
};
