import { defineFlow } from "@operatorstack/boatstack";
import {
  abandonEntry,
  productDeliveryFlow,
  runEntry,
  runWithAbandonment,
} from "@operatorstack/boatstack-software-delivery";

export default defineFlow(productDeliveryFlow({
  id: "product-delivery",
  version: "1",
  description: "Basic React delivery from one repository plan to a published pull request",
  steps: runWithAbandonment,
  entries: [
    runEntry(".boatstack/plans/inbox"),
    abandonEntry(".boatstack/plans/inbox"),
  ],
}));
