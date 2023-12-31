interface User {
  wallet: string;
  telegram_handle: string;
  communities_count: integer;
}

interface Community {
  members_count: integer;
  name: string;
  description: string;
  picture_url: string;
  readable_fee_amount: string;
  owner: User
}

interface Membership {
  keys: integer;
  tier: string;
  initiated_at: string;
  community: Community;
  user: User;
}

export const types = {
  User,
  Community
};
