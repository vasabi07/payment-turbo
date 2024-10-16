import { useRecoilValue } from "recoil"
import { personalInfoAtom } from "./atoms"


const Balance = () => {
    const {balance} = useRecoilValue(personalInfoAtom)
  return (
    <div>
        <div className="">
            Balance: {balance}
        </div>
    </div>
  )
}

export default Balance