export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

export type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  error: Error | null;
  isLoading?: boolean;
  clearUser?: () => void;
};
