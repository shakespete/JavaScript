/* The maximum number of minutes in a period (a day) */
const MAX_IN_PERIOD = 1440;

/**
 * There are 4 possible state transitions:
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

    if (previousState === 'on' && currentState === 'off') {
      energyUsage += currentTs - previousTs;
    }

    previousState = currentState;
    previousTs = currentTs;
  }

  // By this point we have exhausted all the events. BUT the last event could
  // have been left in the 'on' state which means we must take into account the
  // time from that last 'on' state to the end of the day
  const MAX_TS = MAX_IN_PERIOD * day;
  if (previousState === 'on') energyUsage += MAX_TS - previousTs;

  return energyUsage;
};

const calculateEnergySavings = (profile) => {
  const { initial, events } = profile;

  let previousState = initial;
  let previousTs = 0;
  let energySavings = 0;

  for (const event of events) {
    const { timestamp: currentTs, state: currentState } = event;

    if (
      previousState === currentState ||
      (previousState === 'auto-off' && currentState === 'off') ||
      (previousState === 'off' && currentState === 'auto-off')
    )
      continue;

    if (previousState === 'auto-off' && currentState === 'on') {
      energySavings += currentTs - previousTs;
    }
    previousState = currentState;
    previousTs = currentTs;
  }

  if (previousState === 'auto-off') energySavings += MAX_IN_PERIOD - previousTs;
  return energySavings;
};

const isInteger = (number) => Number.isInteger(number);

const dataValidation = (day) => {
  if (!isInteger(day)) throw 'must be an integer';
  if (day < 1 || day > 365) throw 'day out of range';
};

let dataCache = '';
let daysInYear = {};
const calculateEnergyUsageForDay = (monthUsageProfile, day) => {
  dataValidation(day);

  const { initial, events } = monthUsageProfile;

  if (events.length === 0)
    return calculateEnergyUsageSimple({ initial, events: [] });

  // Check data cache
  if (dataCache !== JSON.stringify(monthUsageProfile)) {
    daysInYear = {};
    dataCache = JSON.stringify(monthUsageProfile);

    for (let i = 0; i < events.length; i++) {
      const { timestamp } = events[i];
      const dayIndex = Math.ceil(timestamp / MAX_IN_PERIOD);

      if (!daysInYear[dayIndex]) {
        daysInYear[dayIndex] = {
          initial: events[i - 1] ? events[i - 1].state : initial,
          events: [events[i]],
        };
      } else {
        daysInYear[dayIndex].events.push(events[i]);
      }
    }
  }

  if (daysInYear[day]) return calculateEnergyUsageSimple(daysInYear[day], day);
  else {
    // Get most recent previous day
    let nearestPrev = day;
    while (
      (!daysInYear[nearestPrev] && nearestPrev > 0) || // Data for this day does not exist
      (daysInYear[nearestPrev] && daysInYear[nearestPrev].events.length === 0) // Day does exist but no events
    )
      nearestPrev--;

    let dayInitial = initial;
    if (daysInYear[nearestPrev]) {
      // Get state of last event of the most recent previous day
      const lastEvent = daysInYear[nearestPrev].events.length - 1;
      dayInitial = daysInYear[nearestPrev].events[lastEvent].state;
    }

    return calculateEnergyUsageSimple({ initial: dayInitial, events: [] }, day);
  }
};

module.exports = {
  calculateEnergyUsageSimple,
  calculateEnergySavings,
  calculateEnergyUsageForDay,
  MAX_IN_PERIOD,
};
