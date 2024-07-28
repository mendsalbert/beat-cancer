import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { db } from "../utils/dbConfig";
import { Users, Records } from "../utils/schema";
import { eq } from "drizzle-orm";
import { usePrivy } from "@privy-io/react-auth";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { user, ready, authenticated, login, logout } = usePrivy();
  const [users, setUsers] = useState([]);
  const [records, setRecords] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      const result = await db.select().from(Users).execute();
      setUsers(result);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  const createUser = useCallback(async (userData) => {
    try {
      const newUser = await db
        .insert(Users)
        .values(userData)
        .returning({ id: Users.id, email: Users.email })
        .execute();
      setUsers((prevUsers) => [...prevUsers, newUser[0]]);
      setCurrentUser(newUser[0]);
      return newUser[0];
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }, []);

  const fetchUserRecords = useCallback(async (userEmail) => {
    try {
      const result = await db
        .select()
        .from(Records)
        .where(eq(Records.createdBy, userEmail))
        .execute();
      setRecords(result);
    } catch (error) {
      console.error("Error fetching user records:", error);
    }
  }, []);

  const createRecord = useCallback(async (recordData) => {
    try {
      const newRecord = await db
        .insert(Records)
        .values(recordData)
        .returning({ id: Records.id })
        .execute();
      setRecords((prevRecords) => [...prevRecords, newRecord[0]]);
      return newRecord[0];
    } catch (error) {
      console.error("Error creating record:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      if (user) {
        const existingUser = await db
          .select()
          .from(Users)
          .where(eq(Users.email, user.email.address))
          .execute();
        if (existingUser.length > 0) {
          setCurrentUser(existingUser[0]);
        }
      }
    };
    checkUser();
  }, [user]);

  return (
    <StateContext.Provider
      value={{
        user,
        ready,
        authenticated,
        login,
        logout,
        users,
        records,
        currentUser,
        fetchUsers,
        createUser,
        fetchUserRecords,
        createRecord,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
