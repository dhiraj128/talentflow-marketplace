"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCertificateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_certificate_dto_1 = require("./create-certificate.dto");
class UpdateCertificateDto extends (0, swagger_1.PartialType)(create_certificate_dto_1.CreateCertificateDto) {
}
exports.UpdateCertificateDto = UpdateCertificateDto;
//# sourceMappingURL=update-certificate.dto.js.map