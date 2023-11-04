import axios from "axios";

const getMemberships = (wallet: string) => {
  return axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/${wallet}/memberships`);
}

export const memberships = {
  getMemberships
};
