const {
  calculateEnergyUsageSimple,
  calculateEnergySavings,
  calculateEnergyUsageForDay,
  MAX_IN_PERIOD,
} = require('./index');

// Part 1
describe('calculateEnergyUsageSimple', () => {
  it('should calculate correctly for a simple usage profile with initial state = "on"', () => {
    const usageProfile1 = {
      initial: 'on',
      events: [
        { timestamp: 126, state: 'off' },
        { timestamp: 833, state: 'on' },
      ],
    };
    expect(calculateEnergyUsageSimple(usageProfile1)).toEqual(
      126 + (1440 - 833)
    );
  });

  it('should calculate correctly for a simple usage profile with initial state = "off"', () => {
    const usageProfile2 = {
      initial: 'off',
      events: [
        { timestamp: 30, state: 'on' },
        { timestamp: 80, state: 'off' },
        { timestamp: 150, state: 'on' },
        { timestamp: 656, state: 'off' },
      ],
    };
    expect(calculateEnergyUsageSimple(usageProfile2)).toEqual(
      80 - 30 + (656 - 150)
    );
  });

  it('should calculate correctly when the appliance is on the whole time', () => {
    const usageProfile3 = {
      initial: 'on',
      events: [],
    };
    expect(calculateEnergyUsageSimple(usageProfile3)).toEqual(1440);
  });

  it('should handle duplicate on events', () => {
    const usageProfile = {
      initial: 'off',
      events: [
        { timestamp: 30, state: 'on' },
        { timestamp: 80, state: 'on' },
        { timestamp: 150, state: 'off' },
        { timestamp: 656, state: 'on' },
      ],
    };
    expect(calculateEnergyUsageSimple(usageProfile)).toEqual(
      150 - 30 + (1440 - 656)
    );
  });

  it('should handle duplicate off events', () => {
    const usageProfile = {
      initial: 'on',
      events: [
        { timestamp: 30, state: 'on' },
        { timestamp: 80, state: 'off' },
        { timestamp: 150, state: 'off' },
        { timestamp: 656, state: 'on' },
      ],
    };
    expect(calculateEnergyUsageSimple(usageProfile)).toEqual(
      80 - 0 + (1440 - 656)
    );
  });
});

// Part 2
describe('calculateEnergySavings', () => {
  it('should return zero for always on', () => {
    const usageProfile = {
      initial: 'on',
      events: [],
    };
    expect(calculateEnergySavings(usageProfile)).toEqual(0);
  });

  it('should calculate zero for always switch off manually', () => {
    const usageProfile = {
      initial: 'off',
      events: [],
    };
    expect(calculateEnergySavings(usageProfile)).toEqual(0);
  });

  it('should calculate max period for always switched off automatically', () => {
    const usageProfile = {
      initial: 'auto-off',
      events: [],
    };
    expect(calculateEnergySavings(usageProfile)).toEqual(MAX_IN_PERIOD);
  });

  it('should calculate energy savings correctly on sensible data', () => {
    const usageProfile = {
      initial: 'off',
      events: [
        { state: 'on', timestamp: 100 },
        { state: 'off', timestamp: 150 },
        { state: 'on', timestamp: 200 },
        { state: 'auto-off', timestamp: 500 },
        { state: 'on', timestamp: 933 },
        { state: 'off', timestamp: 1010 },
        { state: 'on', timestamp: 1250 },
        { state: 'auto-off', timestamp: 1320 },
      ],
    };
    expect(calculateEnergySavings(usageProfile)).toEqual(
      933 - 500 + (MAX_IN_PERIOD - 1320)
    );
  });

  it('should calculate energy savings correctly on silly data (example 1)', () => {
    const usageProfile = {
      initial: 'off',
      events: [
        { state: 'on', timestamp: 100 },
        { state: 'off', timestamp: 150 },
        { state: 'on', timestamp: 200 },
        { state: 'auto-off', timestamp: 500 },
        { state: 'off', timestamp: 800 },
        { state: 'on', timestamp: 933 },
        { state: 'off', timestamp: 1010 },
        { state: 'on', timestamp: 1250 },
        { state: 'on', timestamp: 1299 },
        { state: 'auto-off', timestamp: 1320 },
      ],
    };
    expect(calculateEnergySavings(usageProfile)).toEqual(
      933 - 500 + (MAX_IN_PERIOD - 1320)
    );
  });

  it('should calculate energy savings correctly on silly data (example 2)', () => {
    const usageProfile = {
      initial: 'off',
      events: [
        { state: 'on', timestamp: 250 },
        { state: 'on', timestamp: 299 },
        { state: 'auto-off', timestamp: 320 },
        { state: 'off', timestamp: 500 },
      ],
    };
    expect(calculateEnergySavings(usageProfile)).toEqual(MAX_IN_PERIOD - 320);
  });
});

// Part 3
describe('calculateEnergyUsageForDay', () => {
  const monthProfile = {
    initial: 'on',
    events: [
      { state: 'off', timestamp: 500 },
      { state: 'on', timestamp: 900 },
      { state: 'off', timestamp: 1400 },
      { state: 'on', timestamp: 1700 },
      { state: 'off', timestamp: 1900 },
      { state: 'on', timestamp: 2599 },
      { state: 'off', timestamp: 2900 },
      { state: 'on', timestamp: 3000 },
      { state: 'off', timestamp: 3500 },
      { state: 'on', timestamp: 4000 },
      { state: 'off', timestamp: 4420 },
      { state: 'on', timestamp: 4500 },
    ],
  };

  it('should calculate the energy usage for an empty set of events correctly', () => {
    expect(
      calculateEnergyUsageForDay({ initial: 'off', events: [] }, 10)
    ).toEqual(0);
    expect(
      calculateEnergyUsageForDay({ initial: 'on', events: [] }, 5)
    ).toEqual(1440);
  });

  it('should calculate day 1 correctly', () => {
    expect(calculateEnergyUsageForDay(monthProfile, 1)).toEqual(
      500 - 0 + (1400 - 900)
    );
  });

  it('should calculate day 2 correctly', () => {
    expect(calculateEnergyUsageForDay(monthProfile, 2)).toEqual(
      1900 - 1700 + (2880 - 2599)
    );
  });

  it('should calculate day 3 correctly', () => {
    expect(calculateEnergyUsageForDay(monthProfile, 3)).toEqual(
      2900 - 2880 + (3500 - 3000) + (4320 - 4000)
    );
  });

  it('should calculate day 4 correctly', () => {
    expect(calculateEnergyUsageForDay(monthProfile, 4)).toEqual(
      4420 - 4320 + (5760 - 4500)
    );
  });

  it('should calculate day 5 correctly', () => {
    expect(calculateEnergyUsageForDay(monthProfile, 5)).toEqual(MAX_IN_PERIOD);
  });

  it('should calculate day 2 correctly when the first event starts on day 4', () => {
    const monthProfile1 = {
      initial: 'off',
      events: [{ timestamp: 4500, state: 'on' }],
    };
    expect(calculateEnergyUsageForDay(monthProfile1, 2)).toEqual(0);
    expect(calculateEnergyUsageForDay(monthProfile1, 4)).toEqual(1260);
    expect(calculateEnergyUsageForDay(monthProfile1, 15)).toEqual(
      MAX_IN_PERIOD
    );
  });

  it('should throw an error on an out of range day number', () => {
    // The regular expression matches the message of the Error(), which is
    // the first parameter to the Error class constructor.
    expect(() => calculateEnergyUsageForDay(monthProfile, -5)).toThrow(
      /day out of range/
    );
    expect(() => calculateEnergyUsageForDay(monthProfile, 0)).toThrow(
      /day out of range/
    );
    expect(() => calculateEnergyUsageForDay(monthProfile, 366)).toThrow(
      /day out of range/
    );
  });

  it('should throw an error on a non-integer day number', () => {
    expect(() => calculateEnergyUsageForDay(3.76)).toThrow(
      /must be an integer/
    );
  });
});
