"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBillingDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_billing_dto_1 = require("./create-billing.dto");
class UpdateBillingDto extends (0, swagger_1.PartialType)(create_billing_dto_1.CreateBillingDto) {
}
exports.UpdateBillingDto = UpdateBillingDto;
//# sourceMappingURL=update-billing.dto.js.map