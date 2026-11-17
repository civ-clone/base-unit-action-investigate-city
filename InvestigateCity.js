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
 * The mission asks base-unit-agent's seams (its README): `MissionMode` (default `ORDINARY`), then the caught check
 * (`AgentSurvives` with `CAUGHT_CHECK`; a caught Diplomat goes to `AgentLost` and is destroyed by the city's owner,
 * with no `Moved`), then the mission, `Moved`, and `AgentSurvives` with the resolved mode (a Diplomat that doesn't
 * survive goes to `AgentLost` and is destroyed as before). With none of those rules, it is used up as before.
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
        const mode = (0, mission_1.missionMode)(unit, mission, escape_1.ORDINARY, this.ruleRegistry());
        if (!(0, mission_1.agentSurvives)(unit, mission, escape_1.CAUGHT_CHECK, this.ruleRegistry(), undefined, mode)) {
            (0, mission_1.loseAgent)(unit, this._city, mission, true, this.ruleRegistry(), this._city.player());
            return;
        }
        const results = this.ruleRegistry().process(CityInvestigated_1.default, unit, this._city);
        if (!results.includes(true)) {
            return;
        }
        this.ruleRegistry().process(Moved_1.default, unit, mission);
        if (!(0, mission_1.agentSurvives)(unit, mission, mode, this.ruleRegistry())) {
            (0, mission_1.loseAgent)(unit, this._city, mission, false, this.ruleRegistry());
        }
    }
}
exports.InvestigateCity = InvestigateCity;
exports.default = InvestigateCity;
//# sourceMappingURL=InvestigateCity.js.map