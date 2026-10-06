"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestigateCity = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Action_1 = require("@civ-clone/core-unit/Action");
const CityInvestigated_1 = require("./Rules/CityInvestigated");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
/** A Diplomat investigates `city()`. What its owner learns is up to the `CityInvestigated` rules. The Diplomat is used up when the city is investigated. */
class InvestigateCity extends Action_1.default {
    constructor(from, to, unit, city, ruleRegistry = RuleRegistry_1.instance) {
        super(from, to, unit, ruleRegistry);
        this._city = city;
    }
    city() {
        return this._city;
    }
    // `Action.forUnit` rebuilds an action from `(from, to, unit, ruleRegistry)`, which would put the `RuleRegistry` where
    // the `City` goes.
    // Typed as `Action`: a subclass with a member of its own isn't assignable to it (civ-clone/web-renderer#21).
    forUnit(unit) {
        return new InvestigateCity(this.from(), this.to(), unit, this._city, this.ruleRegistry());
    }
    perform() {
        const results = this.ruleRegistry().process(CityInvestigated_1.default, this.unit(), this._city);
        if (!results.includes(true)) {
            return;
        }
        this.ruleRegistry().process(Moved_1.default, this.unit(), this);
        this.unit().destroy();
    }
}
exports.InvestigateCity = InvestigateCity;
exports.default = InvestigateCity;
//# sourceMappingURL=InvestigateCity.js.map