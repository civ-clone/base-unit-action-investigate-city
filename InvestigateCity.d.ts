import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Action from '@civ-clone/core-unit/Action';
import City from '@civ-clone/core-city/City';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
/**
 * A Diplomat investigates `city()`. What its owner learns is up to the `CityInvestigated` rules.
 *
 * The mission asks base-unit-agent's seams (its README): `MissionMode` (default `ORDINARY`), then the caught check
 * (`AgentSurvives` with `CAUGHT_CHECK`; a caught Diplomat goes to `AgentLost` and is destroyed by the city's owner,
 * with no `Moved`), then the mission, `Moved`, and `AgentSurvives` with the resolved mode (a Diplomat that doesn't
 * survive goes to `AgentLost` and is destroyed as before). With none of those rules, it is used up as before.
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
