import { Prisma } from "@prisma/client";
import BaseServerActionActions from "./base";

class PricingServerActions extends BaseServerActionActions {
    public static async getPlans(include: Prisma.PlanInclude = {}) {
        return this.executeAction(
            () => this.prisma.plan.findMany({ include }),
            "Failed to get plans"
        );
    }
}
export default PricingServerActions;