import * as yup from 'yup';

export const validationSchemaStep1 = yup.object().shape({
  password: yup
    .string()
    .required('Required')
    .oneOf([yup.ref('passwordConfirm'), null], "Passwords don't match"),
  passwordConfirm: yup
    .string()
    .required('Required')
    .oneOf([yup.ref('password'), null], "Passwords don't match"),
  name: yup.string().required('Required'),
  email: yup
    .string()
    .email('Invalid email')
    .required('Required'),
  isTermsAccepted: yup
    .bool()
    .oneOf([true], 'Accept Terms and Policy is required')
});

export const validationSchemaStep2 = validationSchemaStep1.shape({
  role: yup.string().required('Required'),
  age: yup
    .number()
    .nullable()
    .positive()
    .integer(),
  pathology: yup
    .array()
    .of(yup.string())
    .nullable()
});

export default validationSchemaStep1;
