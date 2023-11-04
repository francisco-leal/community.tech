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

export const users = {
  createUser
};