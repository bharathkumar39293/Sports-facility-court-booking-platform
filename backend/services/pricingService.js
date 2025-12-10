// PricingService: compute pricing breakdown and total
const PricingRule = require('../models/PricingRule');

function isWeekend(date) {
  const d = new Date(date);
  const day = d.getUTCDay();
  return day === 0 || day === 6;
}

function hourOf(date) {
  const d = new Date(date);
  return d.getUTCHours();
}

async function calculatePrice({ court, startTime, endTime, equipment = {}, coach }) {
  // court: Court model instance
  // equipment: { racketCount, shoeCount }
  // coach: Coach model instance or null

  // load active rules
  const rules = await PricingRule.find({ isActive: true });

  const breakdown = {
    base: court.basePrice,
    rules: [],
    equipment: 0,
    coachFee: 0
  };

  let price = court.basePrice;

  // apply rule by rule
  rules.forEach(rule => {
    const t = rule.ruleType;
    const cfg = rule.config || {};
    if (t === 'weekend' && isWeekend(startTime)) {
      if (cfg.surcharge) { price += cfg.surcharge; breakdown.rules.push({ name: rule.name, amount: cfg.surcharge }); }
    }
    if (t === 'peak') {
      const h = hourOf(startTime);
      if (h >= cfg.startHour && h < cfg.endHour) {
        if (cfg.multiplier) { price *= cfg.multiplier; breakdown.rules.push({ name: rule.name, multiplier: cfg.multiplier }); }
      }
    }
    if (t === 'courtType') {
      if (cfg.type === court.type) {
        if (cfg.surcharge) { price += cfg.surcharge; breakdown.rules.push({ name: rule.name, amount: cfg.surcharge }); }
      }
    }
    if (t === 'holiday' && cfg.dates) {
      const iso = new Date(startTime).toISOString().slice(0,10);
      if (cfg.dates.includes(iso)) {
        if (cfg.surcharge) { price += cfg.surcharge; breakdown.rules.push({ name: rule.name, amount: cfg.surcharge }); }
      }
    }
  });

  // equipment
  if (equipment.racketCount) {
    const racketCost = equipment.racketCount * (equipment.racketPrice || 0);
    breakdown.equipment += racketCost;
    price += racketCost;
  }
  if (equipment.shoeCount) {
    const shoeCost = equipment.shoeCount * (equipment.shoePrice || 0);
    breakdown.equipment += shoeCost;
    price += shoeCost;
  }

  // coach
  if (coach) {
    breakdown.coachFee = coach.hourlyRate;
    price += coach.hourlyRate;
  }

  breakdown.total = Math.round(price * 100) / 100;
  return breakdown;
}

module.exports = { calculatePrice };

