"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import TransactionModal from "./TransactionModal";
import { useRecoilValueLoadable } from "recoil";
import { usersListAtom } from "./atoms";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
};

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User>();
  
  const usersList = useRecoilValueLoadable<User[]>(usersListAtom);

  useEffect(() => {
    if (usersList.state === "hasValue" && usersList.contents) {
      if (searchTerm.trim() === "") {
        setFilteredData(usersList.contents);
      } else {
        const filter = usersList.contents.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.phone.includes(searchTerm)
        );
        setFilteredData(filter);
      }
    }
  }, [usersList,searchTerm]);
  if (usersList.state === "loading") {
    return <div>loading...</div>;
  } else if (usersList.state === "hasValue") {
    return (
      <div className="p-2 flex flex-col justify-center items-center">
        <div className="flex justify-center items-center w-full ">
          <Input
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="p-4 border outline-none  focus:ring-stone-800 focus:border-stone-400 "
            placeholder="Search users with name or phone..."
          />
        </div>
        <div className="w-full ">
          {filteredData && filteredData.length === 0 ? (
            <span>There are no users available on this search term</span>
          ) : (
            filteredData &&
            filteredData.map((user) => (
              <div key={user.id} className="p-2 border-b mb-2 flex justify-between">
               <div className="px-2">
               <p className="text-pretty"> {user.name.toLocaleUpperCase()}</p>
               <p> {user.phone}</p>
               </div>
                <Button className= "rounded-sm bg-stone-100 hover:bg-stone-400" onClick={() => setSelectedUser(user)}>
                  Send money
                </Button>
              </div>
            ))
          )}
        </div>
        {selectedUser && (
          <div className="p-4 w-full ">
            <TransactionModal
              receiverId={selectedUser.id}
              receiverName={selectedUser.name}
              onClose = {()=> setSelectedUser(undefined)}
            />
          </div>
        )}
      </div>
    );
  }
};

export default Search;
