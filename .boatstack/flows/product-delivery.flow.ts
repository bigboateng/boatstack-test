import { defineFlow } from "@operatorstack/boatstack";
import {
  productDeliveryFlow,
  runEntry,
} from "@operatorstack/boatstack-software-delivery";

export default defineFlow(productDeliveryFlow({
  id: "product-delivery",
  version: "1",
  entries: [runEntry(".boatstack/plans/inbox")],
}));
