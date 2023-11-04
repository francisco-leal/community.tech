import axios from "axios";

const createCommunity = (
  wallet: string,
  name: string,
  description: string,
  picture_url: string,
  safe_address: string
  ) => {
  return axios.post(
    `${process.env.API_BASE_URL}/${wallet}/communities`,
    {
      name,
      description,
      picture_url,
      safe_address,
    }
  );
};

const getCommunities = (keyword: string, name: string) => {
  return axios.get(`${process.env.API_BASE_URL}/communtities`, {
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
