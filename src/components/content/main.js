import {useContext} from "react";

import MarketplaceContext from "../../store/marketplace-context";
import CollectionContext from "../../store/collection-context";
import NFTCollection from "./NFTCollection/NFTCollection";
import MintForm from "./MintNFT/MintForm";
import Spinner from "../layout/Spinner";
import logo from "../../img/logo2.png";

const Main = ()=>{
    const marketplaceCtx = useContext(MarketplaceContext);
    const collectionCtx = useContext(CollectionContext);

    return(
        <div className="container-fluid mt-2">
            <div className="row">
                <main role="main" className="col-lg-12 justify-content-center text-center">
                <div className="content mr-auto ml-auto">
                    <img src={logo} alt="logo" width="500" height="140" className="mb-2"/>
                    {!collectionCtx.nftIsLoading && <MintForm />}
                    {collectionCtx.nftIsLoading && <Spinner />}
                </div>
                </main>
            </div>
            <hr/>
            {!marketplaceCtx.mktIsLoading && <NFTCollection />}
            {marketplaceCtx.mktIsLoading && <Spinner />}
        </div>
    )
}

export default Main;