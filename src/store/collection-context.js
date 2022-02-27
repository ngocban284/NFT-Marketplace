import React from "react";

const CollectionContext =  React.createContext({
    contract:null,
    totalSupply:null,
    collection:[],
    loadContract:()=>{},
    loadTotalSupply:()=>{},
    loadCollection:()=>{},
    updateTotalSupply:()=>{},
    updateCollection:()=>{},
    updateOwner:()=>{},
    nftIsLoading:true,
    setNftIsLoading:()=>{}
});

export default  CollectionContext;