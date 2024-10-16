"use client"
import axios from "axios";
import { atom, selector } from "recoil";

export const usersListAtom = atom({
  key: "usersListAtom",
  default: selector({
    key: "usersListAtomSelector",
    get: async () => {
      const response = await axios.get("http://3.26.20.130:8000/users/allusers", {
        withCredentials: true,
        //http://3.26.20.130:8000
      });
      return response.data.payload;
    },
  }),
});

export const personalInfoAtom = atom({
  key: "personalInfoAtom",
  default: selector({
    key: "personalInfoAtomSelector",
    get: async () => {
      const response = await axios.get("http://3.26.20.130:8000/personalInfo", {
        withCredentials: true,
      });
      return response.data.payload;
    },
  }),
});

export const transactionHistoryAtom = atom({
  key: "transactionHistoryAtom",
  default: selector({
    key: "transactionHistoryAtomSelector",
    get: async () => {
      const response = await axios.get("http://3.26.20.130:8000/history", {
        withCredentials: true,
      });
      return response.data.payload;
    },
  }),
});
