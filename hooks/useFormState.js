// hooks/useFormState.js
import { useState } from 'react';

export const useFormState = (action, initialState) => {
  const [state, setState] = useState(initialState);

  const formAction = async (id, formData) => {
    try {
      const result = await action(id, formData);
      setState(result);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return [formAction, state];
};
