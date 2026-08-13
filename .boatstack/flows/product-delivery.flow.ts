import { defineFlow } from "@operatorstack/boatstack";
import {
  productDeliveryFlow,
  runEntry,
} from "@operatorstack/boatstack-software-delivery";

export default defineFlow(productDeliveryFlow({
  id: "product-delivery",
  version: "1",
  description: "Basic React delivery from one repository plan to a published pull request",
  entries: [runEntry(".boatstack/plans/inbox")],
}));
