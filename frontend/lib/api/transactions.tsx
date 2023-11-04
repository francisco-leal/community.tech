import axios from "axios";

const createTransaction = (tx_hash: string, chain_id: string) => {
  return axios.post(
    `${process.env.API_BASE_URL}/transactions`,
    {
      tx_hash,
      chain_id
    }
  );
};

const getTransactions = (wallet: string) => {
  return axios.get(`${process.env.API_BASE_URL}/${wallet}/transactions`);
}

export const transactions = {
  createTransaction,
  getTransactions
};
