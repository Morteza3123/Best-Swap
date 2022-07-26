import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { CgArrowsExchangeAltV } from "react-icons/cg";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { getBestPath } from "../hooks/quick-path";
import {
  setPrimaryTokenaddress,
  setPrimaryTokenContract,
  setSecondaryTokenAddress,
  setSecondaryTokenContract,
} from "../state/counterSlice";
import {
  maticAddress,
  quickRouterAddress,
  routerAbi,
  sushiRouterAddress,
  tokenAbi,
  WMATIC,
} from "../utils/abi";
import { TokensList } from "./TokenLlist";
import TokensModal from "./TokensModal";

export default function ExchangeCard() {
  const [tokenModal, setTokenModal] = useState(false); // flag for open/close tokens modal.
  const [primarySelected, setPrimarySelected] = useState(true); // flag for primary button.
  const [primaryBalance, setPrimaryBalance] = useState("");
  const [secondaryBalance, setSecondaryBalance] = useState("");
  const [secondarySelected, setSecondarySelected] = useState(true); // flag for secondary button.
  const [primaryInputValue, setPrimaryInputValue] = useState<any>("1");
  const [secondaryInputValue, setSecondaryInputValue] = useState<any>("");
  const [buttonFlag, setButtonFlag] = useState(""); // specify selected button for store token key.
  const [outPutLoading, setOutPutLoading] = useState(false);
  const [path, setPath] = useState([]);
  const [pathText, setPathText] = useState("");
  const [primaryName, setPrimaryName] = useState("");
  const [secondaryName, setSecondaryName] = useState("");
  const [perOut, setPerOut] = useState<any>(0);

  const dispatch = useDispatch();
  const account = useSelector((state: any) => state.counter.account);
  const library = useSelector((state: any) => state.counter.library);
  const primaryTokenAddress = useSelector(
    (state: any) => state.counter.primaryTokenAddress
  );
  const secondaryTokenAddress = useSelector(
    (state: any) => state.counter.secondaryTokenAddress
  );
  const primaryTokenContract = useSelector(
    (state: any) => state.counter.primaryTokenContract
  );
  const secondaryTokenContract = useSelector(
    (state: any) => state.counter.secondaryTokenContract
  );

  const showPrimaryBalance = async () => {
    if (primaryTokenContract) {
      try {
        const primaryBalance = await primaryTokenContract.balanceOf(account);
        // console.log(parseFloat(primaryBalance) / 10 ** 18);
        setPrimaryBalance((parseFloat(primaryBalance) / 10 ** 18).toString());
      } catch (error) {
        console.log(error);
      }
    }
  };

  const showSecondaryBalance = async () => {
    if (secondaryTokenContract) {
      try {
        const secondaryBalance = await secondaryTokenContract.balanceOf(
          account
        );
        setSecondaryBalance(
          (parseFloat(secondaryBalance) / 10 ** 18).toString()
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    showPrimaryBalance();
    showSecondaryBalance();
  }, [library, primaryTokenContract, secondaryTokenContract]);

  const btnHandler = (name: string) => {
    setButtonFlag(name);
    setTokenModal(true);
  };

  const changeData = async () => {
    // setOutPutLoading(true)
    const tempTokenAddress = primaryTokenAddress;
    const tempTokenContract = primaryTokenContract;
    const tempName = primaryName;
    const tempValue = primaryInputValue;
    dispatch(setPrimaryTokenaddress(secondaryTokenAddress));
    dispatch(setSecondaryTokenAddress(tempTokenAddress));
    dispatch(setPrimaryTokenContract(secondaryTokenContract));
    dispatch(setSecondaryTokenContract(tempTokenContract));
    setPrimaryInputValue(secondaryInputValue);
    // await showOut()
    setSecondaryInputValue(tempValue);
    const balance0 = primaryBalance;
    const balance1 = secondaryBalance;
    setPrimaryBalance(balance1);
    setSecondaryBalance(balance0);
    setPrimaryName(secondaryName);
    setSecondaryName(tempName);
  };

  const findPath = async () => {
    setPath([primaryTokenAddress, secondaryTokenAddress] as any);
    if (library && primaryTokenContract && secondaryTokenContract) {
      if (primaryTokenAddress === secondaryTokenAddress) return;
      setOutPutLoading(true);
      const routerContract = new ethers.Contract(
        quickRouterAddress,
        routerAbi,
        library
      );

      let fromToken;
      let toToken;

      if (primaryTokenAddress == maticAddress) {
        fromToken = WMATIC;
      } else {
        fromToken = primaryTokenAddress;
      }

      if (secondaryTokenAddress == maticAddress) {
        toToken = WMATIC;
      } else {
        toToken = secondaryTokenAddress;
      }

      const fromTokenContract = new ethers.Contract(
        fromToken,
        tokenAbi,
        library
      );
      const toTokenContract = new ethers.Contract(toToken, tokenAbi, library);

      const fromTokenDecimal = await fromTokenContract.decimals();
      const toTokenDecimal = await toTokenContract.decimals();

      const primaryName = await primaryTokenContract.symbol();
      const secondaryName = await secondaryTokenContract.symbol();
      setPrimaryName(primaryName);
      setSecondaryName(secondaryName);
      const path = await getBestPath(fromToken, toToken);
      console.log(path.text);
      setPath(path.array);
      setPathText(path.text);
      const amountsOut = await routerContract.getAmountsOut(
        (10 ** fromTokenDecimal).toString(),
        path.array
      );
      setPerOut(amountsOut[amountsOut.length - 1] / 10 ** toTokenDecimal);
      setOutPutLoading(false);
    }
  };

  const showOut = async () => {
    if (
      library &&
      primaryTokenContract &&
      secondaryTokenContract &&
      primaryInputValue
    ) {
      if (primaryTokenAddress === secondaryTokenAddress) return;
      setOutPutLoading(true);
      const routerContract = new ethers.Contract(
        quickRouterAddress,
        routerAbi,
        library
      );
      let fromToken;
      let toToken;

      if (primaryTokenAddress == maticAddress) {
        fromToken = WMATIC;
      } else {
        fromToken = primaryTokenAddress;
      }

      if (secondaryTokenAddress == maticAddress) {
        toToken = WMATIC;
      } else {
        toToken = secondaryTokenAddress;
      }

      const fromTokenContract = new ethers.Contract(
        fromToken,
        tokenAbi,
        library
      );
      const toTokenContract = new ethers.Contract(toToken, tokenAbi, library);
      if (path.length == 0) {
        setOutPutLoading(false);
        return;
      }

      const fromTokenDecimal = await fromTokenContract.decimals();
      const toTokenDecimal = await toTokenContract.decimals();
      const finalAmount = (
        Number(primaryInputValue) *
        10 ** fromTokenDecimal
      ).toLocaleString("fullwide", { useGrouping: false });
      const amountsOut = await routerContract.getAmountsOut(finalAmount, path);
      setSecondaryInputValue(
        amountsOut[amountsOut.length - 1] / 10 ** toTokenDecimal
      );
      console.log(amountsOut[amountsOut.length - 1] / 10 ** toTokenDecimal);
      console.log("primaryInputValue :", primaryInputValue);
      console.log("secondaryInputValue :", secondaryInputValue);
      setOutPutLoading(false);
    }
  };

  useEffect(() => {
    showOut();
  }, [
    library,
    primaryTokenAddress,
    secondaryTokenAddress,
    primaryInputValue,
    secondaryInputValue,
  ]);

  useEffect(() => {
    findPath();
  }, [library, primaryTokenAddress, secondaryTokenAddress]);

  const swap = async () => {
    if (!library || !primaryInputValue) return;

    const routerContract = new ethers.Contract(
      quickRouterAddress,
      routerAbi,
      library
    );

    let fromToken;
    let toToken;

    if (primaryTokenAddress == maticAddress) {
      fromToken = WMATIC;
    } else {
      fromToken = primaryTokenAddress;
    }

    if (secondaryTokenAddress == maticAddress) {
      toToken = WMATIC;
    } else {
      toToken = secondaryTokenAddress;
    }

    const fromTokenContract = new ethers.Contract(fromToken, tokenAbi, library);
    const toTokenContract = new ethers.Contract(toToken, tokenAbi, library);
    if (path.length == 0) {
      setOutPutLoading(false);
      return;
    }

    const fromTokenDecimal = await fromTokenContract.decimals();
    const toTokenDecimal = await toTokenContract.decimals();
    const finalAmount = (
      Number(primaryInputValue) *
      10 ** fromTokenDecimal
    ).toLocaleString("fullwide", { useGrouping: false });

    const currentDate = new Date();

    const futureTimestamp = currentDate.getTime() + 20 * 60000;

    const signer = await library.getSigner();

    if (fromToken !== WMATIC) {
      await fromTokenContract.connect(signer).approve(routerContract.address, finalAmount);
    }

    // const result = await routerContract.connect(signer).swapExactTokensForTokens(
    const result = await routerContract.connect(signer).swapExactETHForTokens(
      '0',
      // "0",
      path,
      account,
      futureTimestamp.toString(),
      {
        value: (finalAmount.toString()),
        gasLimit: 3000000
      }
    );

    const receipt = await result.wait();
    if (receipt.status === 1) {
      window.alert("success");
    }
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
                  value={primaryInputValue}
                  onChange={(e) => setPrimaryInputValue(e.target.value)}
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
              {primaryBalance ? (
                <div className="flex justify-end items-center mt-1 text-gray-500 font-normal">
                  <span>Balance : {primaryBalance.toString()}</span>
                </div>
              ) : null}
            </div>
            {/* Change Inputs Icon in Center */}
            <div className="changeInputs flex justify-center items-center relative my-1">
              <CgArrowsExchangeAltV
                onClick={changeData}
                className="  rounded-full absolute font-extrabold text-4xl shadow-WalletLogoShadow bg-blue-100 dark:bg-[#212429] dark:border-[#191B1F]   border-4 border-white cursor-pointer hover:shadow-BoxShadowLight dark:shadow-none transition-all ease-linear duration-200 text-gray-900 dark:text-slate-200"
              />
            </div>
            {/* Swap Input Secondary */}
            <div className="border-solid border-2 border-sky-600 shadow-WalletLogoShadow dark:shadow-gray-800 mb-1 px-4 pt-5 pb-3 rounded-3xl ">
              <div className="inputs flex justify-between">
                <input
                  type="text"
                  placeholder="0.0"
                  value={outPutLoading ? "wait..." : secondaryInputValue}
                  onChange={(e) => setSecondaryInputValue(e.target.value)}
                  className="inputPrimary md:w-2/4 bg-transparent focus:outline-none font-bold text-2xl w-32 placeholder:text-gray-500 text-gray-200"
                />
                <button
                  onClick={() => btnHandler("exchangeSecondary")}
                  className="bg-gray-200 dark:bg-[#2C2F36] dark:shadow-gray-800 dark:text-gray-200 text-gray-800 hover:bg-gray-100 transition-all ease-linear duration-200 tokenSelectorPrimary px-4 py-3 rounded-2xl shadow-WalletLogoShadow font-normal"
                >
                  {secondarySelected ? (
                    <>
                      {/* Replace button text with selected token info */}
                      {TokensList.filter(
                        (token) => token.address === secondaryTokenAddress
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
              {secondaryBalance ? (
                <div className="flex justify-end items-center mt-1 text-gray-500 font-normal">
                  <span>balance : {secondaryBalance.toString()}</span>
                </div>
              ) : null}
            </div>
          </div>
          {/* Swap Footer */}
          <div className="">
            <div className=" flex items-center justify-center mt-3 ">
              <button
                onClick={() => swap()}
                className="flex justify-center items-center  py-4 w-full rounded-2xl font-medium text-lg gap-2 bg-blue-800 text-white opacity-60 shadow-sm shadow-sky-200 border-solid border-2 border-sky-100 hover:bg-blue-600 active:border-sky-500"
              >
                {"SWAP"}
              </button>
            </div>
            {pathText ? (
              <>
                <div className="flex gap-2 py-3">
                  <h2 className="text-gray-200 text-bold">Path :</h2>
                  <h3 className="text-white">{pathText}</h3>
                </div>
                <div className="flex gap-2">
                  <h2 className="text-gray-200 text-bold">
                    1 {primaryName} : {perOut.toFixed(6)} {secondaryName}
                  </h2>
                </div>
              </>
            ) : null}
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
