import {
  SNACKBAR_OPEN,
  SNACKBAR_CLOSE
} from '../../actionTypes';

export function snackbarOpen(text) {
  return {
    type: SNACKBAR_OPEN,
    data: text
  };
}

export function snackbarClose() {
  return {
    type: SNACKBAR_CLOSE
  };
}
