/* The maximum number of minutes in a period (a day) */

const MAX_IN_PERIOD = 1440;

/**
 * PART 1
 *
 * You have an appliance that uses energy, and you want to calculate how
 * much energy it uses over a period of time.
 *
 * As an input to your calculations, you have a series of events that contain
 * a timestamp and the new state (on or off). You are also given the initial
 * state of the appliance. From this information, you will need to calculate
 * the energy use of the appliance i.e. the amount of time it is switched on.
 *
 * The amount of energy it uses is measured in 1-minute intervals over the
 * period of a day. Given there is 1440 minutes in a day (24 * 60), if the
 * appliance was switched on the entire time, its energy usage would be 1440.
 * To simplify calculations, timestamps range from 0 (beginning of the day)
 * to 1439 (last minute of the day).
 *
 * HINT: there is an additional complication with the last two tests that
 * introduce spurious state change events (duplicates at different time periods).
 * Focus on getting these tests working after satisfying the first tests.
 *
 * The structure for `profile` looks like this (as an example):
 * ```
 * {
 *    initial: 'on',
 *    events: [
 *      { state: 'off', timestamp: 50 },
 *      { state: 'on', timestamp: 304 },
 *      { state: 'off', timestamp: 600 },
 *    ]
 * }
 * ```
 */

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

    if (previousState === 'on' && currentState === 'off') {
      energyUsage += currentTs - previousTs;

      previousState = currentState;
      previousTs = currentTs;
    } else if (previousState !== currentState) {
      previousState = currentState;
      previousTs = currentTs;
    }
  }

  // By this point we have exhausted all the events. BUT the last event could
  // have been left in the 'on' state which means we must take into account the
  // time from that last 'on' state to the end of the day
  const MAX_TS = MAX_IN_PERIOD * day;
  if (previousState === 'on') energyUsage += MAX_TS - previousTs;

  return energyUsage;
};

/**
 * PART 2
 *
 * You purchase an energy-saving device for your appliance in order
 * to cut back on its energy usage. The device is smart enough to shut
 * off the appliance after it detects some period of disuse, but you
 * can still switch on or off the appliance as needed.
 *
 * You are keen to find out if your shiny new device was a worthwhile
 * purchase. Its success is measured by calculating the amount of
 * energy *saved* by device.
 *
 * To assist you, you now have a new event type that indicates
 * when the appliance was switched off by the device (as opposed to switched
 * off manually). Your new states are:
 * * 'on'
 * * 'off' (manual switch off)
 * * 'auto-off' (device automatic switch off)
 *
 * (The `profile` structure is the same, except for the new possible
 * value for `initial` and `state`.)
 *
 * Write a function that calculates the *energy savings* due to the
 * periods of time when the device switched off your appliance. You
 * should not include energy saved due to manual switch offs.
 *
 * You will need to account for redundant/non-sensical events e.g.
 * an off event after an auto-off event, which should still count as
 * an energy savings because the original trigger was the device
 * and not manual intervention.
 */

const calculateEnergySavings = (profile) => {
  const { initial, events } = profile;

  let previousState = initial;
  let previousTs = 0;
  let energySavings = 0;

  for (const event of events) {
    const { timestamp: currentTs, state: currentState } = event;

    if (previousState === 'auto-off' && currentState === 'on') {
      energySavings += currentTs - previousTs;

      previousState = currentState;
      previousTs = currentTs;
    } else if (
      (previousState === 'auto-off' && currentState === 'off') ||
      (previousState === 'off' && currentState === 'auto-off')
    ) {
      continue;
    } else if (previousState !== currentState) {
      previousState = currentState;
      previousTs = currentTs;
    }
  }

  if (previousState === 'auto-off') energySavings += MAX_IN_PERIOD - previousTs;

  return energySavings;
};

/**
 * PART 3
 *
 * The process of producing metrics usually requires handling multiple days of data. The
 * examples so far have produced a calculation assuming the day starts at '0' for a single day.
 *
 * In this exercise, the timestamp field contains the number of minutes since a
 * arbitrary point in time (the "Epoch"). To simplify calculations, assume:
 *  - the Epoch starts at the beginning of the month (i.e. midnight on day 1 is timestamp 0)
 *  - our calendar simply has uniform length 'days' - the first day is '1' and the last day is '365'
 *  - the usage profile data will not extend more than one month
 *
 * Your function should calculate the energy usage over a particular day, given that
 * day's number. It will have access to the usage profile over the month.
 *
 * It should also throw an error if the day value is invalid i.e. if it is out of range
 * or not an integer. Specific error messages are expected - see the tests for details.
 *
 * (The `profile` structure is the same as part 1, but remember that timestamps now extend
 * over multiple days)
 *
 * HINT: You are encouraged to re-use `calculateEnergyUsageSimple` from PART 1 by
 * constructing a usage profile for that day by slicing up and rewriting up the usage profile you have
 * been given for the month.
 */

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
    // Get nearest previous day to current
    let nearestPrev = day;
    while (
      (!daysInYear[nearestPrev] && nearestPrev > 0) ||
      (daysInYear[nearestPrev] && daysInYear[nearestPrev].events.length === 0)
    )
      nearestPrev--;

    let dayInitial = initial;
    if (daysInYear[nearestPrev]) {
      // Get state of last event
      const lastEvent = daysInYear[nearestPrev].events.length - 1;
      dayInitial = daysInYear[nearestPrev].events[lastEvent].state;
    }

    return calculateEnergyUsageSimple({ initial: dayInitial, events: [] }, day);
  }
};

const monthProfile = {
  initial: 'on',
  events: [
    // 1: 0
    { state: 'off', timestamp: 500 },
    { state: 'on', timestamp: 900 },
    { state: 'off', timestamp: 1400 },
    // 2: 1440
    { state: 'on', timestamp: 1700 },
    { state: 'off', timestamp: 1900 },
    { state: 'on', timestamp: 2599 },
    // 3: 2880
    { state: 'off', timestamp: 2900 },
    { state: 'on', timestamp: 3000 },
    { state: 'off', timestamp: 3500 },
    { state: 'on', timestamp: 4000 },
    // 4: 4320
    { state: 'off', timestamp: 4420 },
    { state: 'on', timestamp: 4500 },
    // 5: 5760
  ],
};
const monthProfile1 = {
  initial: 'off',
  events: [{ timestamp: 4500, state: 'on' }],
};
// console.log(calculateEnergyUsageForDay(monthProfile1, 2));

module.exports = {
  calculateEnergyUsageSimple,
  calculateEnergySavings,
  calculateEnergyUsageForDay,
  MAX_IN_PERIOD,
};
