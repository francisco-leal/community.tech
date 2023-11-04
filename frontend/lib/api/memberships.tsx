import axios from "axios";

const getMemberships = (wallet: string) => {
  return axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${wallet}/memberships`);
}

export const membershipsApi = {
  getMemberships
};
