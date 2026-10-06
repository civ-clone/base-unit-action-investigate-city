import City from '@civ-clone/core-city/City';
import Rule from '@civ-clone/core-rule/Rule';
import Unit from '@civ-clone/core-unit/Unit';

/** Processed when a Diplomat (`Unit`) investigates `City`. `true` when it was investigated, which uses the Diplomat up. */
export class CityInvestigated extends Rule<[Unit, City], boolean> {}

export default CityInvestigated;
