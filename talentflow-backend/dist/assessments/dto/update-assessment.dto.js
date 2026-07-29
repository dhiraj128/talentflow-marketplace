"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAssessmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_assessment_dto_1 = require("./create-assessment.dto");
class UpdateAssessmentDto extends (0, swagger_1.PartialType)(create_assessment_dto_1.CreateAssessmentDto) {
}
exports.UpdateAssessmentDto = UpdateAssessmentDto;
//# sourceMappingURL=update-assessment.dto.js.map