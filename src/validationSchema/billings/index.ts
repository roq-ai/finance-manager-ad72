import * as yup from 'yup';

export const billingValidationSchema = yup.object().shape({
  cost: yup.number().integer().required(),
  due_date: yup.date().required(),
  category: yup.string().required(),
  paid_status: yup.boolean().required(),
  organization_id: yup.string().nullable(),
});
