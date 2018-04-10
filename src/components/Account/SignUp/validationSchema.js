import Yup from 'yup';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('passwordConfirm'), null], "Passwords don't match"),
  passwordConfirm: Yup.string()
    .required('Required')
    .oneOf([Yup.ref('password'), null], "Passwords don't match"),
  name: Yup.string().required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required')
});

export default validationSchema;
