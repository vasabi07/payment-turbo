"use client";
import { transactionHistoryAtom } from "app/components/atoms";
import React from "react";
import { useRecoilValueLoadable } from "recoil";

interface tHistory {
  id: number;
  senderId: number;
  receiverId: number;
  amount: number;
  status: string;
  timestamp: string;
}
const TransactionHistory = () => {
  const history = useRecoilValueLoadable<tHistory[]>(transactionHistoryAtom);

  if (history.state === "loading") {
    return <div>loading....</div>;
  } else if (history.state === "hasError") {
    return <div>there was an error getting details</div>;
  } else if (history.state === "hasValue") {
    return (
      <div>
        {history.contents.map((item: tHistory) => (
          <div className=" bg-slate-300 p-4 flex justify-between items-center text-lg">
            <span>Sender:{item.senderId}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>

            <span className="flex items-center justify-between"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
{item.amount}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
              />
            </svg>

            <span>Receiver:{item.receiverId}</span>
            <span>{item.status}</span>

            <span> {item.status === "Success" ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 bg-green-500 rounded-full">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
<path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

}</span>
          </div>
        ))}
      </div>
    );
  }
};

export default TransactionHistory;
