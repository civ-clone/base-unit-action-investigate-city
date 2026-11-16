import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Action from '@civ-clone/core-unit/Action';
import City from '@civ-clone/core-city/City';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
/**
 * A Diplomat investigates `city()`. What its owner learns is up to the `CityInvestigated` rules.
 *
 * Before the mission, the Diplomat must survive a caught check (base-unit-agent's `AgentSurvives` with
 * `CAUGHT_CHECK`); one that doesn't is destroyed and the city isn't investigated. Once the city is investigated, it is
 * used up unless it survives an `ORDINARY` check. With no `AgentSurvives` rules, the check passes and it is used up.
 */
export declare class InvestigateCity extends Action {
  protected _city: City;
  constructor(
    from: Tile,
    to: Tile,
    unit: Unit,
    city: City,
    ruleRegistry?: RuleRegistry
  );
  city(): City;
  forUnit(unit: Unit): Action;
  perform(): void;
}
export default InvestigateCity;
