import React from "react";

const MarketplaceContext = React.createContext({
    contract:null,
    offerCount:null,
    offers:[],
    userFunds:null,
    loadContract:()=>{},
    loadOfferCount:()=>{},
    loadOffers:()=>{},
    loadUserFunds:()=>{},
    addOffer:()=>{},
    updateOffer:()=>{},
    mktIsLoading:true,
    setMktIsLoading:()=>{}
});

export default MarketplaceContext;