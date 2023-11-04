interface User {
  wallet: string;
  telegram_handle: string;
}

interface Community {
  members_count: integer;
  name: string;
  description: string;
  profile_picture: string;
  readable_fee_amount: string;
  owner: User
}

export const types = {
  User,
  Community
};
