import {
  defineFlow,
  entry,
  entryInput,
  fact,
  foregroundWork,
  fromWorkOutput,
  instructionAsset,
  marked,
  workArtifact,
  workInput,
} from "@operatorstack/boatstack";
import {
  inbox,
  planningPackage,
  softwareDelivery,
  trustedDelegation,
  workPackageAdmit,
} from "@operatorstack/boatstack-software-delivery";

const producer = foregroundWork({
  id: "work-a",
  instructions: instructionAsset(".boatstack/flows/assets/foreground-work-input-producer.md"),
  inputs: [entryInput("plan")],
  outputs: [
    workArtifact({ id: "implementation-plan", path: "implementation-plan.md", media_type: "text/markdown", required: true, max_bytes: 131072 }),
    workArtifact({ id: "architecture", path: "architecture.md", media_type: "text/markdown", required: true, max_bytes: 131072 }),
  ],
});

const architectureInput = workInput({
  id: "architecture",
  producer: fromWorkOutput({ work: "work-a", output: "architecture" }),
});

const consumerB = foregroundWork({
  id: "work-b",
  instructions: instructionAsset(".boatstack/flows/assets/foreground-work-input-consumer.md"),
  inputs: [architectureInput],
  outputs: [
    workArtifact({ id: "consumer-b-result", path: "consumer-b-result.md", media_type: "text/markdown", required: true, max_bytes: 131072 }),
  ],
});

const consumerC = foregroundWork({
  id: "work-c",
  instructions: instructionAsset(".boatstack/flows/assets/foreground-work-input-consumer.md"),
  inputs: [architectureInput],
  outputs: [
    workArtifact({ id: "consumer-c-result", path: "consumer-c-result.md", media_type: "text/markdown", required: true, max_bytes: 131072 }),
  ],
});

const approveWithConsumer = { id: "work.package.approve", priority: 44, work: "work-b" };
const promoteWithConsumer = { id: "planning.package.promote", priority: 45, work: "work-c" };

export default defineFlow(softwareDelivery({
  id: "foreground-work-input-proof",
  version: "1",
  humanIdentity: "developer",
  lifecycle: [workPackageAdmit, approveWithConsumer, promoteWithConsumer],
  planningPackage: planningPackage({ work: producer, planOutput: "implementation-plan" }),
  work: [consumerB, consumerC],
  targets: [
    marked("approved-plan", fact("plan", ["approved"])),
  ],
  entries: [
    entry({
      id: "prove",
      target: "approved-plan",
      requires: { authorities: ["human"] },
      inputs: [inbox(".boatstack/plans/foreground-work-input-proof")],
      delegation: trustedDelegation("autonomy"),
    }),
  ],
}));
