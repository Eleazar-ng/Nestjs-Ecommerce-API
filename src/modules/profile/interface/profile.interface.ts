export interface CreateProfile {
  userId: string;
}

export interface GetProfile {
  id?: string;
  userId?: string;
}

export interface UpdateProfile {
  dob?: string;
  avatar?: string;
  phone?: string;
}

export interface GetProfileByUserId {
  userId: string;
}