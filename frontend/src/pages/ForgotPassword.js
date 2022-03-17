import { useDispatch } from 'react-redux';
import { userActions } from '../redux/user';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import Card from '../components/UI/Card';
import FormButton from '../components/UI/FormButton';
import styles from './Auth.module.css';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { setError } = userActions;

  const initialValues = { email: '' };

  const validationSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Required'),
  });

  const submitHandler = (values, { setSubmitting, resetForm }) => {
    const { email } = values;
    fetchSendCode(email);
    setSubmitting(false);
    resetForm();
  };

  const fetchSendCode = async (email) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/reset_password/send_code`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
    } catch (error) {
      dispatch(setError({ message: error.message }));
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.form}>
        <h2>Send Code</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitHandler}
        >
          <Form>
            <div className={styles.field}>
              <label htmlFor='email'>Email</label>
              <Field name='email' type='email' />
              <span>
                <ErrorMessage name='email' />
              </span>
            </div>
            <section className={styles.foot}>
              <FormButton className={styles.button} type='submit'>
                Submit
              </FormButton>
            </section>
          </Form>
        </Formik>
      </Card>
    </div>
  );
};

export default ForgotPassword;
