const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PricingRuleSchema = new Schema({
  name: String,
  ruleType: { type: String },
  isActive: { type: Boolean, default: true },
  config: Schema.Types.Mixed
});

module.exports = mongoose.model('PricingRule', PricingRuleSchema);

