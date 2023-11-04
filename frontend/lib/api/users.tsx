import axios from "axios";

const createUser = (wallet: string, telegram_handle: string) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
    {
      wallet,
      telegram_handle
    }
  );
};

const getUser = (wallet: string) => {
  return axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${wallet}`
  );
};



export const users = {
  createUser,
  getUser
};
