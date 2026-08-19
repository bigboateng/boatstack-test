import {
  defineFlow,
  entry,
  entryInput,
  fact,
  foregroundWork,
  instructionAsset,
  marked,
  schemaAsset,
  workArtifact,
} from "@operatorstack/boatstack";
import {
  inbox,
  softwareDelivery,
  trustedDelegation,
  workPackage,
  workPackageAdmit,
  workPackageApprove,
} from "@operatorstack/boatstack-software-delivery";

const acceptedWork = foregroundWork({
  id: "accepted-work-package",
  instructions: instructionAsset(".boatstack/flows/assets/accepted-work-package.md"),
  inputs: [entryInput("plan")],
  outputs: [
    workArtifact({ id: "implementation-plan", path: "implementation-plan.md", media_type: "text/markdown", required: true, max_bytes: 262144, guidance: instructionAsset(".boatstack/flows/assets/implementation-plan.md") }),
    workArtifact({ id: "architecture-plan", path: "architecture-plan.md", media_type: "text/markdown", required: true, max_bytes: 262144, guidance: instructionAsset(".boatstack/flows/assets/architecture-plan.md") }),
    workArtifact({ id: "feature-spec", path: "feature-spec.md", media_type: "text/markdown", required: true, max_bytes: 262144, guidance: instructionAsset(".boatstack/flows/assets/feature-spec.md") }),
    workArtifact({ id: "questions", path: "questions.md", media_type: "text/markdown", required: true, max_bytes: 131072, guidance: instructionAsset(".boatstack/flows/assets/questions.md") }),
    workArtifact({ id: "test-plan", path: "test-plan.md", media_type: "text/markdown", required: true, max_bytes: 262144, guidance: instructionAsset(".boatstack/flows/assets/test-plan.md") }),
    workArtifact({ id: "gaps", path: "gaps.md", media_type: "text/markdown", required: true, max_bytes: 131072, guidance: instructionAsset(".boatstack/flows/assets/gaps.md") }),
    workArtifact({ id: "autonomy", path: "autonomy.md", media_type: "text/markdown", required: true, max_bytes: 131072, guidance: instructionAsset(".boatstack/flows/assets/autonomy.md") }),
    workArtifact({ id: "tasks", path: "compiled/tasks.json", media_type: "application/json", required: true, max_bytes: 262144, guidance: instructionAsset(".boatstack/flows/assets/tasks.md"), schema: schemaAsset(".boatstack/flows/assets/tasks.schema.json") }),
    workArtifact({ id: "verification-contract", path: "compiled/verification-contract.json", media_type: "application/json", required: true, max_bytes: 262144, guidance: instructionAsset(".boatstack/flows/assets/verification-contract.md"), schema: schemaAsset(".boatstack/flows/assets/verification-contract.schema.json") }),
    workArtifact({ id: "test-matrix", path: "compiled/test-matrix.json", media_type: "application/json", required: true, max_bytes: 262144, guidance: instructionAsset(".boatstack/flows/assets/test-matrix.md"), schema: schemaAsset(".boatstack/flows/assets/test-matrix.schema.json") }),
    workArtifact({ id: "journey-oracles", path: "compiled/journey-oracles.json", media_type: "application/json", required: true, max_bytes: 262144, guidance: instructionAsset(".boatstack/flows/assets/journey-oracles.md"), schema: schemaAsset(".boatstack/flows/assets/journey-oracles.schema.json") }),
    workArtifact({ id: "evidence", path: "compiled/evidence.md", media_type: "text/markdown", required: true, max_bytes: 131072, guidance: instructionAsset(".boatstack/flows/assets/evidence.md") }),
  ],
});

export default defineFlow(softwareDelivery({
  id: "work-package-proof",
  version: "1",
  humanIdentity: "developer",
  lifecycle: [workPackageAdmit, workPackageApprove],
  workPackage: workPackage({ work: acceptedWork }),
  targets: [
    marked("approved-package", fact("work-package", ["approved"])),
  ],
  entries: [
    entry({
      id: "accept",
      target: "approved-package",
      requires: { authorities: ["human"] },
      inputs: [inbox(".boatstack/plans/work-package-proof")],
      delegation: trustedDelegation("autonomy"),
    }),
  ],
}));
