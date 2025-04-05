export type User = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

export type UserContextType = {
  user: User | null | undefined;
  setUser: (user: User | null | undefined) => void;
  error: Error | null;
  isLoading?: boolean;
  clearUser?: () => void;
};
