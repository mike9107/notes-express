import FormButton from '../UI/FormButton';
import styles from './DeleteNoteForm.module.css';

const DeleteNoteForm = (props) => {
  const submitFormHandler = (event) => {
    event.preventDefault();
    props.onSubmit();
  };

  return (
    <form className={styles.form} onSubmit={submitFormHandler}>
      <h3>Are you sure you want to delete?</h3>
      <div>
        <FormButton cancel onClick={props.onCancel}>
          No
        </FormButton>
        <FormButton type='submit'>Yes</FormButton>
      </div>
    </form>
  );
};

export default DeleteNoteForm;
