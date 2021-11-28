import { createContext } from "react";

const userState = {
  userId: null,
  setUserId: () => {},
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserContext = createContext<any>(userState as any);

export default UserContext;
