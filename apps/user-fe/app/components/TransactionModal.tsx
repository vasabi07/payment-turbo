"use client";
import { Input } from "@/components/ui/input";
import axios from "axios";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRecoilValue } from "recoil";
import { personalInfoAtom } from "./atoms";

const TransactionModal = ({
  receiverId,
  receiverName,
  onClose
}: {
  receiverId: string;
  receiverName: string;
  onClose: ()=> void
}) => {
  const [money, setMoney] = useState(0);
  const [userPin,setUserPin] = useState<string| null>(null)
  const {pin} = useRecoilValue(personalInfoAtom)
  const [processing,setProcessing] = useState(false)
  const startTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNaN(money) || money <= 0 || pin!==userPin) {
      console.error("Please enter a valid amount.");
      return;
    }
    try {
      console.log({ receiverId, amount: money });
      const response = await axios.post(
        "http://13.211.25.11:8000/transfer",
        {
          receiverId: receiverId.toString(),
          amount: money,
        },
        {
          withCredentials: true,
        }
      );

      if(response.status===200){
        setProcessing(true);
      }
      console.log(response);
    } catch (error) {
      console.log("transaction failed at the frontend", error);
    }
  };

  return (
    <div>
      {!processing && <Card className="flex flex-col gap-2 bg-gray-100 ">
        <CardHeader className="flex justify-center items-center pt-2 text-xl ">
          <CardTitle>Enter the amount below</CardTitle>
        </CardHeader>
        <form className="flex flex-col justify-between p-2 gap-2">
          <CardContent>
            <Input
              name="amount"
              type="number"
              className="p-2 outline-none focus:border-slate-900"
              onChange={(e) => setMoney(parseFloat(e.target.value))}
              placeholder="Amount"
            />
          </CardContent>
          <CardContent>Enter your PIN below</CardContent>
          <CardContent> <Input
              name="amount"
              type="number"
              className="p-2 outline-none focus:border-slate-900"
              onChange={(e) => setUserPin(e.target.value)}
              placeholder="Amount"
            /></CardContent>
          <CardContent>You are sending money to:{receiverName}</CardContent>
          <CardContent>
            <Button
              className="w-full hover:bg-gray-300"
              onClick={startTransaction}
              type="button"
            >
              Pay
            </Button>
          </CardContent>
        
        </form>

      </Card>}
      <div className=" w-full bg-blue-200 ">
      {processing && (<><div className="p-2 ">
            your transaction is being processed.<br/> close the modal and go to TransactionHistory page to see the result.
            </div>
            <div>
              <Button onClick={()=> {
                setProcessing(false)
                onClose()
              }}>Close</Button>
            </div></>)}
      </div>
      
    </div>
  );
};

export default TransactionModal;
