"use client"
import { userInfoSchema } from "@/zod";
import z from "zod"
import {  useRecoilValueLoadable } from "recoil";
import { personalInfoAtom } from "./atoms";
type UserType = z.infer<typeof userInfoSchema>;
const UserInfo = () => {
  const userInfo = useRecoilValueLoadable<UserType>(personalInfoAtom)

  if (userInfo.state === "loading") {
    return <div>userInfo details are loading...</div>;
  } else if(userInfo.state === "hasValue") {
    return (
      <div>
        {userInfo.contents.name}
        {userInfo.contents.phone}
      </div>
    );
  }
};

export default UserInfo;
