import { createSlice } from '@reduxjs/toolkit';
import {
  fetchLogin,
  fetchSignup,
  fetchResetToken,
  resetPassword,
  sendPasswordResetLink,
  loadNotes,
  createNote,
  editNote,
  deleteNote,
  shareNote,
  getSharedNote,
  updateSharedNote,
} from './userAsyncThunks';
import getCompareFunction from './getCompareFunction';

const initialState = {
  userId: null,
  token: null,
  tokenExpirationDate: null,
  refreshToken: null,
  isLoggedIn: false,
  fetchedNotes: [],
  notes: [],
  isLoading: false,
  error: null,
  sharingToken: null,
  sharedNote: null,
  sharedNotePermission: null,
};

const loadingStateHandler = (state) => {
  state.isLoading = true;
};
const errorStateHandler = (state, action) => {
  state.isLoading = false;
  state.error = action.payload;
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      const { token, refreshToken, expirationDate } = action.payload;
      const tokenExpirationDate =
        expirationDate ||
        new Date(new Date().getTime() + 1000 * 60 * 57).toISOString();
      state.token = token;
      if (refreshToken) state.refreshToken = refreshToken;
      state.tokenExpirationDate = tokenExpirationDate;
      state.isLoggedIn = true;
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('tokenExpirationDate', tokenExpirationDate);
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpirationDate');
      return initialState;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSharingToken: (state) => {
      state.sharingToken = null;
    },
    sortNotes: (state, action) => {
      const { selection } = action.payload;
      state.notes.sort(getCompareFunction(selection));
    },
    filterNotes: (state, action) => {
      const { searchFor } = action.payload;
      state.notes = state.fetchedNotes.filter((note) =>
        searchFor === ''
          ? true
          : (note.title + note.content)
              .toLowerCase()
              .includes(searchFor.toLowerCase())
      );
    },
  },
  extraReducers: {
    // login
    [fetchLogin.pending]: loadingStateHandler,
    [fetchLogin.rejected]: errorStateHandler,
    [fetchLogin.fulfilled]: (state, action) => {
      const { userId, token, refreshToken } = action.payload;
      state.userId = userId;
      state.isLoading = false;
      if (token)
        userSlice.caseReducers.login(state, {
          payload: { token, refreshToken },
        });
    },
    // signup
    [fetchSignup.pending]: loadingStateHandler,
    [fetchSignup.rejected]: errorStateHandler,
    [fetchSignup.fulfilled]: (state, action) => {
      const { userId, token, refreshToken } = action.payload;
      state.userId = userId;
      state.isLoading = false;
      if (token)
        userSlice.caseReducers.login(state, {
          payload: { token, refreshToken },
        });
    },
    //fetchResetToken
    [fetchResetToken.pending]: loadingStateHandler,
    [fetchResetToken.rejected]: errorStateHandler,
    [fetchResetToken.fulfilled]: (state, action) => {
      const { token } = action.payload;
      state.isLoading = false;
      if (token)
        userSlice.caseReducers.login(state, {
          payload: { token, refreshToken: state.refreshToken },
        });
    },
    //resetPassword
    [resetPassword.pending]: loadingStateHandler,
    [resetPassword.rejected]: errorStateHandler,
    [resetPassword.fulfilled]: (state, action) => {
      const { userId, token, refreshToken } = action.payload;
      state.userId = userId;
      state.isLoading = false;
      if (token)
        userSlice.caseReducers.login(state, {
          payload: { token, refreshToken },
        });
    },
    //sendPasswordResetLink
    [sendPasswordResetLink.pending]: loadingStateHandler,
    [sendPasswordResetLink.rejected]: errorStateHandler,
    [sendPasswordResetLink.fulfilled]: (state, action) => {
      state.isLoading = false;
    },
    // loadNotes
    [loadNotes.pending]: loadingStateHandler,
    [loadNotes.rejected]: errorStateHandler,
    [loadNotes.fulfilled]: (state, action) => {
      const notes = action.payload.notes.reverse();
      state.fetchedNotes = notes;
      state.notes = notes;
      state.isLoading = false;
    },
    // createNote
    [createNote.pending]: loadingStateHandler,
    [createNote.rejected]: errorStateHandler,
    [createNote.fulfilled]: (state, action) => {
      const createdNote = action.payload.note;
      state.fetchedNotes.unshift(createdNote);
      state.notes.unshift(createdNote);
      state.isLoading = false;
    },
    // editNote
    [editNote.pending]: loadingStateHandler,
    [editNote.rejected]: errorStateHandler,
    [editNote.fulfilled]: (state, action) => {
      const editedNote = action.payload.note;
      const idx1 = state.fetchedNotes.findIndex(
        (note) => note.id === editedNote.id
      );
      state.fetchedNotes[idx1] = editedNote;
      const idx2 = state.notes.findIndex((note) => note.id === editedNote.id);
      state.notes[idx2] = editedNote;
      state.isLoading = false;
    },
    // deleteNote
    [deleteNote.pending]: loadingStateHandler,
    [deleteNote.rejected]: errorStateHandler,
    [deleteNote.fulfilled]: (state, action) => {
      const deletedNoteId = action.payload.noteId;
      state.fetchedNotes = state.fetchedNotes.filter(
        (note) => note.id !== deletedNoteId
      );
      state.notes = state.notes.filter((note) => note.id !== deletedNoteId);
      state.isLoading = false;
    },
    // shareNote
    [shareNote.pending]: loadingStateHandler,
    [shareNote.rejected]: errorStateHandler,
    [shareNote.fulfilled]: (state, action) => {
      state.sharingToken = action.payload.token;
      state.isLoading = false;
    },
    //getSharedNote
    [getSharedNote.pending]: loadingStateHandler,
    [getSharedNote.rejected]: errorStateHandler,
    [getSharedNote.fulfilled]: (state, action) => {
      const { note, permission } = action.payload;
      state.isLoading = false;
      state.sharedNote = note;
      state.sharedNotePermission = permission;
    },
    //updateSharedNote
    [updateSharedNote.pending]: loadingStateHandler,
    [updateSharedNote.rejected]: errorStateHandler,
    [updateSharedNote.fulfilled]: (state, action) => {
      state.isLoading = false;
      const { note } = action.payload;
      state.sharedNote = note;
    },
  },
});

export const userActions = userSlice.actions;
export const userReducer = userSlice.reducer;
