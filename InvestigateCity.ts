import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import { CAUGHT_CHECK, ORDINARY } from '@civ-clone/base-unit-agent/lib/escape';
import Action from '@civ-clone/core-unit/Action';
import City from '@civ-clone/core-city/City';
import CityInvestigated from './Rules/CityInvestigated';
import Moved from '@civ-clone/core-unit/Rules/Moved';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import { agentSurvives } from '@civ-clone/base-unit-agent/lib/mission';

/**
 * A Diplomat investigates `city()`. What its owner learns is up to the `CityInvestigated` rules.
 *
 * Before the mission, the Diplomat must survive a caught check (base-unit-agent's `AgentSurvives` with
 * `CAUGHT_CHECK`); one that doesn't is destroyed and the city isn't investigated. Once the city is investigated, it is
 * used up unless it survives an `ORDINARY` check. With no `AgentSurvives` rules, the check passes and it is used up.
 */
export class InvestigateCity extends Action {
  protected _city: City;

  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    city: City,
    ruleRegistry: RuleRegistry = ruleRegistryInstance
  ) {
    super(from, to, unit, ruleRegistry);

    this._city = city;
  }

  city(): City {
    return this._city;
  }

  // `Action.forUnit` rebuilds an action from `(from, to, unit, ruleRegistry)`, which would put the `RuleRegistry` where
  // the `City` goes.
  // Typed as `Action`: a subclass with a member of its own isn't assignable to it (civ-clone/web-renderer#21).
  forUnit(unit: Unit): Action {
    return new InvestigateCity(
      this.from(),
      this.to(),
      unit,
      this._city,
      this.ruleRegistry()
    ) as unknown as Action;
  }

  perform(): void {
    const unit = this.unit(),
      mission = this as unknown as Action;

    if (!agentSurvives(unit, mission, CAUGHT_CHECK, this.ruleRegistry())) {
      this.ruleRegistry().process(Moved, unit, mission);

      unit.destroy();

      return;
    }

    const results = this.ruleRegistry().process(
      CityInvestigated,
      unit,
      this._city
    );

    if (!results.includes(true)) {
      return;
    }

    this.ruleRegistry().process(Moved, unit, mission);

    if (!agentSurvives(unit, mission, ORDINARY, this.ruleRegistry())) {
      unit.destroy();
    }
  }
}

export default InvestigateCity;
