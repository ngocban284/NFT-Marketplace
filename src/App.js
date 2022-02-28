import React,{useEffect,useContext} from "react";

import web3 from "./connection/web3";
import Navbar from "./components/layout/Navbar";
import Main from "./components/content/main";
import CollectionContext from "./store/collection-context";
import Web3Context from "./store/web3-context";
import MarketplaceContext from "./store/marketplace-context";
import NFTCollection from "./abis/NFTCollection.json";
import NFTMarketplace from "./abis/NFTMarketplace.json";


const App = ()=>{
  const web3Ctx = useContext(Web3Context);
  const collectionCtx = useContext(CollectionContext);
  const marketplaceCtx = useContext(MarketplaceContext);

  useEffect(() => {
    if (!web3) {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
      return;
    }
    
    //fetch blockchain data 
    const loadBlockchainData = async()=>{
      // Request accounts acccess if needed
      try {
        await window.ethereum.request({method:'eth_requestAccounts'});
      } catch (error) {
        console.error(error);
      }

      //load account
      const account = await web3Ctx.loadAccount(web3);

      //load networkId
      const networkId = await web3Ctx.loadNetwordId(web3);

       //load contract
       const nftDeployedNetwork = NFTCollection.networks[networkId];
       const nftContract = collectionCtx.loadContract(web3,NFTCollection,nftDeployedNetwork);

       const mktDeployedNetwork = NFTMarketplace.networks[networkId];
       const mktContract = marketplaceCtx.loadContract(web3,NFTMarketplace,mktDeployedNetwork);

       if (nftContract) {
         //load totalSupply
         const totalSupply = await collectionCtx.loadTotalSupply(nftContract);

         //load collection
         await collectionCtx.loadCollection(nftContract,totalSupply);

          // Event subscription
          nftContract.events.Transfer()
          .on("data",(event)=>{
            collectionCtx.updateCollection(nftContract,event.returnValues.tokenId,event.returnValues.to);
            collectionCtx.setNftIsLoading(false);
          })
          .on("error",(error)=>{
            console.log(error);
          })
       }else{
          window.alert('NFTCollection contract not deployed to detected network.')
       }

       if (mktContract) {
          // load offerCount
          const offerCount = await marketplaceCtx.loadOfferCount(mktContract);

          // load offers
          await marketplaceCtx.loadOffers(mktContract,offerCount);
          
          // load user funds
          account && marketplaceCtx.loadUserFunds(mktContract,account);

          // Event OfferFilled subscription 
          mktContract.events.OfferFilled()
          .on("data",(event)=>{
            marketplaceCtx.updateOffer(event.returnValues.offerId);
            collectionCtx.updateOwner(event.returnValues.id,event.returnValues.newOwner);
            collectionCtx.setNftIsLoading(false);
          })
          .on("error",(error)=>{
            console.log(error);
          })

          // Event Offer subscription 
          mktContract.events.Offer()
          .on("data",(event)=>{
            marketplaceCtx.addOffer(event.returnValues);
            marketplaceCtx.setMktIsLoading(false);
          })
          .on("error",(error)=>{
            console.log(error);
          })

          // Event offerCancelled subscription 
          mktContract.events.OfferCancelled()
          .on("data",(event)=>{
            marketplaceCtx.updateOffer(event.returnValues.offerId);
            collectionCtx.updateOwner(event.returnValues.id,event.returnValues.owner);
            marketplaceCtx.setMktIsLoading(false);
          })
          .on("error",(error)=>{
            console.log(error);
          })

        } else {
           window.alert('NFTMarketplace contract not deployed to detected network.');
        }

        collectionCtx.setNftIsLoading(false);
        marketplaceCtx.setMktIsLoading(false);

        // Metamask Event Subscription - Account changed
        window.ethereum.on('accountsChanged', (accounts) => {
          web3Ctx.loadAccount(web3);
          accounts[0] && marketplaceCtx.loadUserFunds(mktContract, accounts[0]);
        });

        // Metamask Event Subscription - Network changed
        window.ethereum.on('chainChanged', (chainId) => {
          window.location.reload();
        });
    }

    loadBlockchainData();
  }, []);
  
  const showNavbar = web3 && collectionCtx.contract && marketplaceCtx.contract;
  const showContent = web3 && collectionCtx.contract && marketplaceCtx.contract && web3Ctx.account;

  return(
    <React.Fragment>
      {showNavbar && <Navbar />}
      {showContent && <Main />}
    </React.Fragment>
  )
}


export default App;
