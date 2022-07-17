import React, { useState } from "react";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { TokensList } from "./TokenLlist";
import TokensModal from "./TokensModal";

export default function ExchangeCard() {
  const [tokenModal, setTokenModal] = useState(false); // flag for open/close tokens modal.
  const [primarySelected, setPrimarySelected] = useState(true); // flag for primary button.
  //
  const [secondarySelected, setSecondarySelected] = useState(true); // flag for secondary button.

  const [buttonFlag, setButtonFlag] = useState(""); // specify selected button for store token key.

  const dispatch = useDispatch();
  const account = useSelector((state: any) => state.counter.account);
  const library = useSelector((state: any) => state.counter.library);
  const primaryTokenAddress = useSelector((state: any) => state.counter.primaryTokenAddress);
  const secondaryTokenAddress = useSelector((state: any) => state.counter.secondaryTokenAddress);


  const btnHandler = (name: string) => {
    setButtonFlag(name);
    setTokenModal(true);
  };



  return (
    <div className="h-screen bg-gradient-to-b from-black  to-gray-900 bg-gray-900">
      <div className="mx-auto flex justify-center items-center h-screen">
        {/* Swap Container */}
        <div className="md:w-2/3 lg:w-1/3  w-full mx-4 md:mx-0 p-2.5 md:p-5 rounded-3xl bg-gradient-to-l from-gray-900 to-gray-950 shadow-md shadow-sky-500  bottom-4 border-solid border-2 border-blue-300">
          {/* Swap Content */}
          <div className="Content mt-3 font-medium ltrDirection">
            <div className="border-solid border-2 border-sky-600 shadow-WalletLogoShadow dark:shadow-gray-800 mb-1 px-4 pt-5 pb-3 rounded-3xl ">
              <div className="inputs flex justify-between">
                <input
                  type="number"
                  placeholder="0.0"
                  className="inputPrimary md:w-2/4 bg-transparent focus:outline-none font-bold text-2xl w-32 placeholder:text-gray-500 text-gray-200"
                />
                <button
                  onClick={() => btnHandler("exchangePrimary")}
                  className="bg-gray-200 text-gray-800 hover:bg-gray-100 dark:bg-[#2C2F36] dark:shadow-gray-800 dark:text-gray-200 transition-all ease-linear duration-200 tokenSelectorPrimary px-4 py-3 rounded-2xl shadow-WalletLogoShadow font-normal"
                >
                  {primarySelected ? (
                    <>
                      {/* Replace button text with selected token info */}
                      {TokensList.filter(
                        (token) => token.address === primaryTokenAddress
                      ).map((token) => {
                        return (
                          <div
                            key={token.key}
                            className="flex items-center gap-2 m-0 p-0 w-[85px] justify-center"
                          >
                            <img
                              src={token.image}
                              alt=""
                              className="w-6 h-6 rounded-full"
                            />
                            <h1 className="text-lg font-semibold">
                              {token.shortName}
                            </h1>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="flex items-center">
                      <span className="md:font-medium sm:text-base vs:text-sm">
                        {"select_token"}
                      </span>
                      <span>
                        <RiArrowDropDownLine className="text-2xl font-bold" />
                      </span>
                    </div>
                  )}
                </button>
              </div>
              <div className="flex justify-end items-center mt-1 text-gray-500 font-normal">
                <span>Balance</span>
              </div>
            </div>
            {/* Change Inputs Icon in Center */}
            <div className="changeInputs flex justify-center items-center relative my-1">
              <CgArrowsExchangeAltV
                // onClick={changeData}
                className="  rounded-full absolute font-extrabold text-4xl shadow-WalletLogoShadow bg-blue-100 dark:bg-[#212429] dark:border-[#191B1F]   border-4 border-white cursor-pointer hover:shadow-BoxShadowLight dark:shadow-none transition-all ease-linear duration-200 text-gray-900 dark:text-slate-200"
              />
            </div>
            {/* Swap Input Secondary */}
            <div className="border-solid border-2 border-sky-600 shadow-WalletLogoShadow dark:shadow-gray-800 mb-1 px-4 pt-5 pb-3 rounded-3xl ">
              <div className="inputs flex justify-between">
                <input
                  type="number"
                  placeholder="0.0"
                  className="inputPrimary md:w-2/4 bg-transparent focus:outline-none font-bold text-2xl w-32 placeholder:text-gray-500 text-gray-200"
                />
                <button 
                  onClick={() => btnHandler("exchangeSecondary")}
                  className="bg-gray-200 dark:bg-[#2C2F36] dark:shadow-gray-800 dark:text-gray-200 text-gray-800 hover:bg-gray-100 transition-all ease-linear duration-200 tokenSelectorPrimary px-4 py-3 rounded-2xl shadow-WalletLogoShadow font-normal">
                  {secondarySelected ? (
                    <>
                      {/* Replace button text with selected token info */}
                      {TokensList.filter(
                        (token) =>
                          token.address === secondaryTokenAddress
                      ).map((token) => {
                        return (
                          <div
                            key={token.key}
                            className="flex items-center gap-2 m-0 p-0 w-[85px] justify-center"
                          >
                            <img
                              src={token.image}
                              alt=""
                              className="w-6 h-6 rounded-full"
                            />
                            <h1 className="text-lg font-semibold">
                              {token.shortName}
                            </h1>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div className="flex items-center">
                      <span className="md:font-medium sm:text-base vs:text-sm">
                        {"select_token"}
                      </span>
                      <span>
                        <RiArrowDropDownLine className="text-2xl font-bold" />
                      </span>
                    </div>
                  )}
                </button>
              </div>
              <div className="flex justify-end items-center mt-1 text-gray-500 font-normal">
                <span>balance</span>
              </div>
            </div>
          </div>
          {/* Swap Footer */}
          <div className="">
            <div className=" flex items-center justify-center mt-3 ">
              <button className="flex justify-center items-center  py-4 w-full rounded-2xl font-medium text-lg gap-2 bg-sky-500 text-white opacity-60 shadow-sm shadow-sky-200 border-solid border-2 border-sky-100 hover:bg-sky-400 active:border-sky-500">
                {"SWAP"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Tokens Modal */}
      {tokenModal ? (
        <TokensModal
          tokenModal={tokenModal}
          setTokenModal={setTokenModal}
          buttonFlag={buttonFlag}
          setPrimarySelected={setPrimarySelected}
          setSecondarySelected={setSecondarySelected}
        />
      ) : null}

      {/* {swapConfirm ? (
        <SwapConfirmModal
          swapConfirm={swapConfirm}
          setSwapConfirm={setSwapConfirm}
          swap={swap}
        />
      ) : null}

      {swapLoading ? (
        <Loading loading={swapLoading} setLoading={setSwapLoading} />
      ) : null}

      {swapAlert ? (
        <AlertModal
          alertModal={swapAlert}
          setAlertModal={setSwapAlert}
          status={status}
        />
      ) : null}

      {setting ? (
        <SettingModal setting={setting} setSetting={setSetting} />
      ) : null} */}

      {/* Test new components here */}
    </div>
  );
}
