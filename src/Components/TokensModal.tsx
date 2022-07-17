import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import { CgClose } from 'react-icons/cg';
import { TokensModalProps } from '../interfaces/TokensModalProps';
import { TokensList } from './TokenLlist';
import { useDispatch } from 'react-redux';
import { setPrimaryTokenaddress, setSecondaryTokenAddress } from '../state/counterSlice';

export default function TokensModal({
    tokenModal,
    setTokenModal,
    buttonFlag,
    setPrimarySelected,
    setSecondarySelected,
}: TokensModalProps) {

    const [search, setSearch] = useState("");

    const dispatch = useDispatch();

    const selectTokenHandler = (tokenAddress: string) => {
        if (buttonFlag === "exchangePrimary") {
            dispatch(setPrimaryTokenaddress(tokenAddress));
            setTokenModal(!tokenModal);
            setPrimarySelected(true);
        }else if (buttonFlag === "exchangeSecondary") {
            dispatch(setSecondaryTokenAddress(tokenAddress));
            setTokenModal(!tokenModal);
            setSecondarySelected(true);
        }
    }

    const filterTokens = TokensList.filter((token) => {
        return token.fullName.toLowerCase().includes(search.toLowerCase());
    });

  return (
    <Transition appear show={tokenModal} as={Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-10 overflow-y-auto backdrop-blur-[1px] bg-slate-600 bg-opacity-40 dark:bg-gray-800 dark:bg-opacity-10"
                onClose={setTokenModal}
            >
                <div className="min-h-screen px-4 text-center flex justify-center items-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0" />
                    </Transition.Child>

                    <span className="inline-block align-middle" aria-hidden="true"></span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-sm p-5 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-[#191B1F] shadow-xl rounded-2xl">
                            {/* Modal Header */}
                            <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200"
                            >
                                <div className="flex justify-between items-center ">
                                    <span>{("select_a_token")}</span>
                                    <CgClose
                                        className="text-2xl cursor-pointer"
                                        onClick={() => setTokenModal(!tokenModal)}
                                    />
                                </div>
                            </Dialog.Title>
                            {/* Modal Container */}
                            <div className="mt-6">
                                <div className="search flex justify-center">
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder={("search_placeholder")}
                                        className="searchInput w-full text-lg rounded-2xl p-2 px-3 font-medium focus:outline-none shadow-WalletLogoShadow dark:bg-[#191B1F] dark:shadow-zinc-800 text-gray-200"
                                    />
                                </div>
                                <div className="tokensList mt-5 mb-3 w-full  bg-gray-300 dark:bg-[#212429] dark:shadow-inner h-72 p-2 rounded-xl shadow-WalletLogoShadow overflow-y-scroll ">
                                    {filterTokens.map((token) => {
                                        return (
                                            <div
                                                onClick={() =>
                                                    selectTokenHandler(token.address || "")
                                                }
                                                key={token.key}
                                                className="tokenContainer bg-gray-100 dark:bg-[#191B1F] my-2  flex items-center gap-3 rounded-xl px-2 py-1 text-gray-900 dark:text-gray-200 dark:hover:bg-[#212429] dark:hover:shadow-zinc-900 hover:bg-blue-400 hover:shadow-BTNShadow transition-all ease-linear duration-200 cursor-pointer"
                                            >
                                                <div className="tokenIcon rounded-full ">
                                                    <img
                                                        className="w-9 h-9 rounded-full"
                                                        src={token.image}
                                                    />
                                                </div>
                                                <div
                                                    className={
                                                        document.body.dir === "rtl"
                                                            ? `text-right`
                                                            : `text-left`
                                                    }
                                                >
                                                    <h1 className=" font-bold">
                                                        {token.shortName}
                                                    </h1>
                                                    <p className="text-xs font-medium text-gray-500">
                                                        {token.fullName}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
  )
}
