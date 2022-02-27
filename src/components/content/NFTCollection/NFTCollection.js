import {useContext,useRef,createRef} from "react";

import web3 from "../../../connection/web3";
import Web3Context from "../../../store/web3-context";
import CollectionContext from "../../../store/collection-context";
import MarketplaceContext from "../../../store/marketplace-context";
import {formatPrice} from "../../../helpers/utils";
import eth from "../../../img/eth.png";

const NFTCollection = ()=>{
    const web3Ctx = useContext(Web3Context);
    const collectionCtx = useContext(CollectionContext);
    const marketplaceCtx = useContext(MarketplaceContext);

    const priceRefs = useRef([]);
    if (priceRefs.current.length !== collectionCtx.collection.length) {
        priceRefs.current = Array(collectionCtx.collection.length).fill().map((_, i) => priceRefs.current[i] || createRef());
    }

    const makeOfferHandler = (event,id,key)=>{
        event.preventDefault();

        const enteredPrice = web3.utils.toWei(priceRefs.current[key].current.value , "ether");
        collectionCtx.contract.methods.approve(marketplaceCtx.contract.options.address,id).send({from:web3Ctx.acccount})
        .on("transactionHash",(hash)=>{
            marketplaceCtx.setMktIsLoading(true);
        })
        .on("receipt",(receipt)=>{
            marketplaceCtx.contract.methods.makeOffer(id,enteredPrice).send({from:web3Ctx.acccount})
            .on("error",(error)=>{
                window.alert('Something went wrong when pushing to the blockchain');
                marketplaceCtx.setMktIsLoading(false);
            })
        });
    }

    const buyOfferHandler = (event)=>{
        const buyIndex = event.target.value;// what offerid user buy

        marketplaceCtx.contract.methods.fillOffer(marketplaceCtx.offers[buyIndex].offerId).send({from:web3Ctx.acccount,value:marketplaceCtx.offers[buyIndex].price})
        .on("transactionHash",(hash)=>{
            marketplaceCtx.setMktIsLoading(true);
        })
        .on("error",(error)=>{
            window.alert('Something went wrong when pushing to the blockchain');
            marketplaceCtx.setMktIsLoading(false);
        })
    }

    const cancelHandler = (event)=>{
        const cancelIndex = event.target.value;

        marketplaceCtx.contract.methods.cancelOffer(makeOfferHandler.offers[cancelIndex].offerId).send({from:web3Ctx.acccount})
        .on("transactionHash",(hash)=>{
            marketplaceCtx.setMktIsLoading(true);
        })
        .on("error",(error)=>{
            window.alert('Something went wrong when pushing to the blockchain');
            marketplaceCtx.setMktIsLoading(false);
        })
    }


    return(
        <div className="row text-center">
            {collectionCtx.collection.map((NFT,key)=>{
                const index = marketplaceCtx.offers ? marketplaceCtx.offers.findIndex(offer => offer.id === NFT.id) : -1;
                const owner = index === -1 ? NFT.owner : marketplaceCtx.offers[index].user;
                const price = index === -1 ? formatPrice(marketplaceCtx.offers[index].price).toFixed(2) : null;

                
            })}
        </div>
    )



}