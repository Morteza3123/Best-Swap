import { createSlice } from '@reduxjs/toolkit'
import { TokensList } from '../Components/TokenLlist';

const initialState = {
  account: '',
  library: null,
  routerContract: null,
  primaryTokenAddress: TokensList[0].address,
  secondaryTokenAddress: TokensList[1].address,
  primaryTokenContract: null,
  secondaryTokenContract: null
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setAccount: (state:any, action:any) => {
      state.account = action.payload;
    },
    setLibrary: (state:any, action:any) => {
      state.library = action.payload
    },
    setRouterContract: (state:any, action:any) => {
      state.routerContract = action.payload
    },
    setPrimaryTokenaddress: (state:any, action:any) => {
      state.primaryTokenAddress = action.payload
    },
    setSecondaryTokenAddress: (state:any, action:any) => {
      state.secondaryTokenAddress = action.payload
    },
    setPrimaryTokenContract: (state:any, action:any) => {
      state.primaryTokenContract = action.payload
    },
    setSecondaryTokenContract: (state:any, action:any) => {
      state.secondaryTokenContract = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setAccount, setLibrary, setRouterContract, setPrimaryTokenaddress, setSecondaryTokenAddress, setPrimaryTokenContract, setSecondaryTokenContract,  } = counterSlice.actions

export default counterSlice.reducer