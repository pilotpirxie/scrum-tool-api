const Joi = require('joi');

export default function validate(schema: any, data: any) {
  const mixedSchema = Joi.object({ ...schema }).unknown();
  const result = mixedSchema.validate(data);
  return result.error;
}
