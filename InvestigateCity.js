"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestigateCity = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const escape_1 = require("@civ-clone/base-unit-agent/lib/escape");
const Action_1 = require("@civ-clone/core-unit/Action");
const CityInvestigated_1 = require("./Rules/CityInvestigated");
const Moved_1 = require("@civ-clone/core-unit/Rules/Moved");
const mission_1 = require("@civ-clone/base-unit-agent/lib/mission");
/**
 * A Diplomat investigates `city()`. What its owner learns is up to the `CityInvestigated` rules.
 *
 * Before the mission, the Diplomat must survive a caught check (base-unit-agent's `AgentSurvives` with
 * `CAUGHT_CHECK`); one that doesn't is destroyed and the city isn't investigated. Once the city is investigated, it is
 * used up unless it survives an `ORDINARY` check. With no `AgentSurvives` rules, the check passes and it is used up.
 */
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
        const unit = this.unit(), mission = this;
        if (!(0, mission_1.agentSurvives)(unit, mission, escape_1.CAUGHT_CHECK, this.ruleRegistry())) {
            this.ruleRegistry().process(Moved_1.default, unit, mission);
            unit.destroy();
            return;
        }
        const results = this.ruleRegistry().process(CityInvestigated_1.default, unit, this._city);
        if (!results.includes(true)) {
            return;
        }
        this.ruleRegistry().process(Moved_1.default, unit, mission);
        if (!(0, mission_1.agentSurvives)(unit, mission, escape_1.ORDINARY, this.ruleRegistry())) {
            unit.destroy();
        }
    }
}
exports.InvestigateCity = InvestigateCity;
exports.default = InvestigateCity;
//# sourceMappingURL=InvestigateCity.js.map