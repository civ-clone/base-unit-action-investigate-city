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
import {
  agentSurvives,
  loseAgent,
  missionMode,
} from '@civ-clone/base-unit-agent/lib/mission';

/**
 * A Diplomat investigates `city()`. What its owner learns is up to the `CityInvestigated` rules.
 *
 * The mission asks base-unit-agent's seams (its README): `MissionMode` (default `ORDINARY`), then the caught check
 * (`AgentSurvives` with `CAUGHT_CHECK`; a caught Diplomat goes to `AgentLost` and is destroyed by the city's owner,
 * with no `Moved`), then the mission, `Moved`, and `AgentSurvives` with the resolved mode (a Diplomat that doesn't
 * survive goes to `AgentLost` and is destroyed as before). With none of those rules, it is used up as before.
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

    const mode = missionMode(unit, mission, ORDINARY, this.ruleRegistry());

    if (
      !agentSurvives(
        unit,
        mission,
        CAUGHT_CHECK,
        this.ruleRegistry(),
        undefined,
        mode
      )
    ) {
      loseAgent(
        unit,
        this._city,
        mission,
        true,
        this.ruleRegistry(),
        this._city.player()
      );

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

    if (!agentSurvives(unit, mission, mode, this.ruleRegistry())) {
      loseAgent(unit, this._city, mission, false, this.ruleRegistry());
    }
  }
}

export default InvestigateCity;
