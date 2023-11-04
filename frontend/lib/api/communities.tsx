import axios from "axios";

const createCommunity = async (
  wallet: string,
  name: string,
  description: string,
  picture_url: string,
  safe_address: string
  ) => {
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${wallet}/communities`,
    {
      name,
      description,
      picture_url,
      safe_address,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

const getCommunities = (keyword: string, name: string) => {
  return axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/communtities`, {
    params: {
      keyword: keyword,
      name: name,
    }
  });
}

export const communities = {
  createCommunity,
  getCommunities
};