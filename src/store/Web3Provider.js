import { useReducer } from "react";

import Web3Context from "./web3-context";

const defaultState = {
    account:null,
    networkId:null,
}

const web3Reducer = (state,action)=>{
    if (action.type === "ACCOUNT") {
        return{
            account:action.account,
            networkId:state.networkId
        }
        
    }

    if (action.type === "NETWORKID") {
        return{
            account:state.account,
            networkId:action.networkId
        };
    }

    return defaultState;
}

const Web3Provider = (props)=>{
    const [web3State,dispatchWeb3Action] = useReducer(web3Reducer,defaultState);

    const loadAccountHandler = async(web3)=>{
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        dispatchWeb3Action({account:account,type:"ACCOUNT"});
        return account;
    }

    const loadNetwordIdHanlder = async(web3)=>{
        const networkId = await web3.eth.net.getId();
        dispatchWeb3Action({networkId:networkId,type:"NETWORKID"});
        return networkId;
    }

    const web3Context = {
        account:web3State.account,
        networkId:web3State.networkId,
        loadAccount :loadAccountHandler,
        loadNetwordId : loadNetwordIdHanlder
    }

    return(
        <Web3Context.Provider value={web3Context}>
            {props.children}
        </Web3Context.Provider>
    )
}

export default Web3Provider