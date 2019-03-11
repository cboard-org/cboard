import * as yup from 'yup';

const validationSchema = yup.object().shape({
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
    .required('Required')
});

export default validationSchema;
