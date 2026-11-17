# base-unit-action-investigate-city

The `InvestigateCity` unit action. See civ-clone/web-renderer#58.

## The agent survives, or not

The mission asks base-unit-agent's seams in the order its README gives:

1. `MissionMode`: the mode the Diplomat will escape with (default `ORDINARY`).
2. The caught check (`AgentSurvives` with `CAUGHT_CHECK`): a Diplomat that is caught is reported to `AgentLost`
   (`caught`) and destroyed by the city's owner, with no `Moved`, and the mission doesn't happen.
3. The mission; one that doesn't happen (the rules answer no) leaves the Diplomat where it is.
4. `Moved`, then `AgentSurvives` with the resolved mode: a Diplomat that doesn't survive is reported to `AgentLost` and
   destroyed, as it always was. A rule that keeps it must spend its moves.

With none of those rules registered, only the mission, `Moved` and the destruction happen, as before.
