"use client";
import { useRecoilValueLoadable } from "recoil";
import { personalInfoAtom } from "./components/atoms";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
interface UserType {
  name: string;
  email: string;
  phone: string;
  balance: number;
}
export default function Home() {
  const userInfo = useRecoilValueLoadable<UserType>(personalInfoAtom);
  if (userInfo.state === "loading") {
    <div>loading...</div>;
  } else if (userInfo.state === "hasError") {
    <div>error in getting user info</div>;
  } else if (userInfo.state === "hasValue") {
    return (
      <div className="  flex justify-end m-2 items-center   ">
        <div className="flex flex-col shadow-md justify-center items-center w-[188px] h-[200px] border-2 bg-blue-100 ">
        <Avatar>
          <AvatarImage className="w-12 h-12 rounded-full" src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

       <div className="flex flex-col justify-center items-center text-lg font-bold">
       <span>{userInfo.contents.name.toUpperCase()}</span>
       <span>Balance:{userInfo.contents.balance}</span>
       </div>
        </div>
      </div>
    );
  }
}
