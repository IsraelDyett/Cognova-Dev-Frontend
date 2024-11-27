import { Prisma } from "@prisma/client";
import BaseServerActionActions from "./base";

class BusinessServerActions extends BaseServerActionActions {
    public static async get(include: Prisma.ModelInclude = {}) {
        return this.executeAction(
            () => this.prisma.model.findMany({ include }),
            "Failed to get models"
        );
    }
}
export default BusinessServerActions;