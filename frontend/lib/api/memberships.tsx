import axios from "axios";

const getMemberships = (wallet: string) => {
  return axios.get(`${process.env.API_BASE_URL}/${wallet}/memberships`);
}

export const memberships = {
  getMemberships
};
