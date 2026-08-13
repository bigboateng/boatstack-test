import { all, defineFlow, entry, fact, marked } from "@operatorstack/boatstack";
import {
  inbox,
  planInboxResolver,
  softwareDeliveryEvidence,
  softwareDeliveryFacets,
  trustedOperators,
  trustedTransitions,
  type TrustedStep,
} from "@operatorstack/boatstack-software-delivery";

const lifecycle = [
  { id: "plan.create", priority: 35 },
  { id: "plan.validate", priority: 40 },
  { id: "plan.invalidate", priority: 41 },
  { id: "plan.amend", priority: 42 },
  { id: "plan.approve", priority: 45 },
  { id: "plan.approve-amendment", priority: 46 },
  { id: "plan.activate", priority: 50 },
  { id: "workspace.cut", priority: 52 },
  { id: "workspace.activate", priority: 53 },
  { id: "workspace.sync", priority: 58 },
  { id: "gate.build.record", priority: 61 },
  { id: "gate.test.record", priority: 62 },
  { id: "gate.review.record", priority: 63 },
  { id: "gate.change.record", priority: 64 },
  { id: "gate.journey.record", priority: 64 },
  { id: "evidence.visual.attach", priority: 66 },
  { id: "delivery.slice.advance", priority: 68 },
  { id: "publication.preview", priority: 72 },
  { id: "workspace.publish", priority: 75 },
  { id: "publication.execute", priority: 76 },
  { id: "publication.observe", priority: 77 },
  { id: "publication.correct", priority: 80 },
  { id: "workspace.reconcile", priority: 2 },
  { id: "publication.reconcile", priority: 1 },
  { id: "plan.abandon", priority: 31 },
] satisfies TrustedStep[];

export default defineFlow({
  id: "product-delivery",
  version: "1",
  description: "Basic React delivery from one repository plan to a published pull request",
  declarations: { input_resolvers: [planInboxResolver] },
  facets: softwareDeliveryFacets,
  evidence: softwareDeliveryEvidence,
  operators: trustedOperators(lifecycle),
  transitions: trustedTransitions(lifecycle),
  targets: [
    marked("published-pr", all(
      fact("verification", ["current"]),
      fact("configuration", ["verified"]),
      fact("runtime", ["verified"]),
      fact("publication", ["open"]),
    )),
    marked("safely-abandoned", all(
      fact("delivery", ["discarded"]),
      fact("workspace", ["abandoned", "absent"]),
    )),
  ],
  entries: [
    entry(
      "run",
      "published-pr",
      [inbox(".boatstack/plans/inbox")],
      "Implement one approved repository plan and publish a pull request",
    ),
    entry(
      "abandon",
      "safely-abandoned",
      [inbox(".boatstack/plans/inbox")],
      "Explicitly abandon the selected delivery before starting different work",
    ),
  ],
});
