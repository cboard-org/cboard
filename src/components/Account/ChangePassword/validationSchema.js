import * as yup from 'yup';

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, 'Password has to be longer than 6 characters!')
    .required('New Password is required!'),
  passwordRepeat: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Password repeat is required!')
});

export default validationSchema;
