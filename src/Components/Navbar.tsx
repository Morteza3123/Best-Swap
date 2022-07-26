import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { web3Modal } from "./Web3Modal";
import { ethers } from "ethers";
import { setAccount, setLibrary, setPrimaryTokenContract, setSecondaryTokenContract } from "../state/counterSlice";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { tokenAbi } from "../utils/abi";

export default function Navbar() {
  const dispatch = useDispatch();
  const account = useSelector((state: any) => state.counter.account);
  const library = useSelector((state: any) => state.counter.library);
  const primaryTokenAddress = useSelector((state: any) => state.counter.primaryTokenAddress);
  const secondaryTokenAddress = useSelector((state: any) => state.counter.secondaryTokenAddress);

  const connect = async () => {
    const provider = await web3Modal.connect();
    const library = new ethers.providers.Web3Provider(provider);
    if (library) {
      dispatch(setLibrary(library));
    }
    const accounts = await library.listAccounts();
    if (accounts) {
      dispatch(setAccount(accounts[0]));
    }
    localStorage.setItem("BestDex", "injected");
    const primaryTokenContract = new ethers.Contract(primaryTokenAddress, tokenAbi, library)
    dispatch(setPrimaryTokenContract(primaryTokenContract))
    const secondaryTokenContract = new ethers.Contract(secondaryTokenAddress, tokenAbi, library)
    dispatch(setSecondaryTokenContract(secondaryTokenContract))
  };

  const disConnect = async () => {
    if(library){
      await web3Modal.clearCachedProvider()
      dispatch(setLibrary(null))
      dispatch(setAccount(''))
      dispatch(setPrimaryTokenContract(null))
      dispatch(setSecondaryTokenContract(null))
      localStorage.clear()
    }
  }

  useEffect(() => {
    const wallet = localStorage.getItem("BestDex")
    if(wallet === "injected"){
      connect()
    }
  },[])

  return (
    <nav className="flex justify-between items-center w-full h-16 px-4 bg-black text-gray-50 ">
      <a className="flex-start" href="http://localhost:3000/">
        Best-Swap
      </a>
      <ul className="navbar-nav px-3">
        <li className="nav-item">
          {!account ? (
            <button
              className="text-secondary border-solid border-2 border-sky-500 shadow-md shadow-sky-400 py-3 rounded-3xl p-4 px-6 hover:bg-gray-800 active:border-gray-200"
              onClick={() => connect()}
            >
              Connect
            </button>
          ) : (
            <div className="flex">
              <button
                className="text-secondary border-solid border-2 border-sky-500 shadow-md shadow-sky-400 px-2 md:py-3 rounded-3xl md:p-4 md:px-6 hover:bg-gray-800 active:border-gray-200"
                onClick={() => connect()}
              >
                {`${account.slice(0, 5)} .... ${account.slice(-6, -1)}`}
              </button>
              <div
                className="bg-red-700 hover:bg-red-600 my-auto  mx-2 p-2 rounded-3xl "
                title={"logout"}
              >
                <RiLogoutCircleRLine
                  className="Disconnect cursor-pointer text-white dark:text-gray-200 text-xl md:text-3xl"
                  onClick={() => disConnect()}
                />
              </div>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}
