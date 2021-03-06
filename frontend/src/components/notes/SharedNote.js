import { useState } from 'react';
import EditNoteForm from '../forms/EditNoteForm';
import Card from '../UI/Card';
import styles from './SharedNote.module.css';

const SharedNote = (props) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleIsEditingHandler = () => {
    setIsEditing((prevState) => !prevState);
  };

  const submitEditNoteHandler = (title, content) => {
    props.onSubmit(title, content);
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      {!props.readOnly && isEditing ? (
        <EditNoteForm
          onCancel={toggleIsEditingHandler}
          onSubmit={submitEditNoteHandler}
          defaultTitle={props.title}
          defaultContent={props.content}
        />
      ) : (
        <Card className={styles.note}>
          <h1>{props.title}</h1>
          <p>{props.content}</p>
          {!props.readOnly && (
            <div className={styles.buttons}>
              <button onClick={toggleIsEditingHandler}>✏️</button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default SharedNote;
