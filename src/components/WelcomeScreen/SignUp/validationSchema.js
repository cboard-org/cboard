import Yup from 'yup';

const validationSchema = Yup.object().shape({
  gender: Yup.string().required('Required'),
  language: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
  // TODO: Verify if passwords match.
  // `ref` is being fixed in Yup
  passwordConfirm: Yup.string().required('Required'),
  name: Yup.string().required('Required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Required'),
  age: Yup.number()
    .min(1, "Can't be zero or less")
    .max(100, "Can't be more than 100")
    .required('Required')
});

export default validationSchema;
