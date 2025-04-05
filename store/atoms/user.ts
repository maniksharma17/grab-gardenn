import { localStorageEffect } from "@/lib/utils";
import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: {
    _id: "",
    name: "",
    email: "",
    phone: "",
    address: [
      {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    ],
    token: null,
    isLoggedIn: false,
    createdAt: "",
    updatedAt: "",
  },
  effects: [localStorageEffect("user")],
}, 
);
