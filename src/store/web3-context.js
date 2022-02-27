import React from "react";

const Web3Context = React.createContext({
    acccount:null,
    networkId:null,
    loadAccount:()=>{},
    loadNetwordId:()=>{}
});

export default Web3Context;