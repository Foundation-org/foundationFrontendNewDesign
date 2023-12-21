import api from "./Axios";

export const signUp = async (data) => {
  return await api.post("/user/signUpUser", {
    userEmail: data.email,
    userPassword: data.password,
  });
};

export const signIn = async (data) => {
  return await api.post("/user/signInUser", data);
};

export const userInfo = async (uuid) => {
  return await api.post("/user/userInfo", { uuid });
};
export const changePassword = async (params) => {
  return await api.put("/user/changePassword", params);
};

export const getAllLedgerData = async (page, limit, sort, uuid) => {
  return await api.get("/ledger/ledgerById", {
    params: { page, limit, sort, uuid },
  });
};

export const searchLedger = async (page, limit, sort, term) => {
  return await api.post("/ledger/searchLedger", {
    params: { page, limit, sort, term },
  });
};

export const deleteAccount = async (uuid) => {
  return await api.delete(`/delete/${uuid}`);
};

export const createGuestMode = async () => {
  return await api.post("/user/create/guestMode");
};
