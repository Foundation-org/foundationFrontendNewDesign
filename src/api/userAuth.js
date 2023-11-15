import api from './Axios';

export const signUp = async (data) => {
  return await api.post('/user/signUpUser', {
    userEmail: data.email,
    userPassword: data.password,
  });
};

export const signIn = async (data) => {
  return await api.post('/user/signInUser', data);
};

export const userInfo = async (uuid) => {
  return await api.post('/user/userInfo', { uuid });
};
export const changePassword = async (params) => {
  return await api.put('/user/changePassword', params);
};

export const getAllQuestsWithDefaultStatus = async (params) => {
  return await api.post('/infoquestions/getAllQuestsWithDefaultStatus', params);
};

export const getAllLedgerData = async () => {
  return await api.get('/ledger');
};

// export const updateTodo = async (todo) => {
//     return await todosApi.patch(`/todos/${todo.id}`, todo)
// }

// export const deleteTodo = async ({ id }) => {
//     return await todosApi.delete(`/todos/${id}`, id)
// }
