/**
 * utils/generateSlots.js
 * Returns an array of 9 time-slot labels starting at 09:00,
 * each slot is 15 minutes wide.
 *
 * Output: ["09:00 - 09:15", "09:15 - 09:30", ..., "11:00 - 11:15"]
 */

const generateSlots = () => {
  const slots = [];
  // Start at 09:00 (in minutes from midnight)
  let start = 9 * 60; // 540 minutes

  for (let i = 0; i < 9; i++) {
    const startH = String(Math.floor(start / 60)).padStart(2, '0');
    const startM = String(start % 60).padStart(2, '0');
    const end    = start + 15;
    const endH   = String(Math.floor(end / 60)).padStart(2, '0');
    const endM   = String(end % 60).padStart(2, '0');

    slots.push(`${startH}:${startM} - ${endH}:${endM}`);
    start = end;
  }

  return slots; // 9 slots
};

module.exports = generateSlots;
