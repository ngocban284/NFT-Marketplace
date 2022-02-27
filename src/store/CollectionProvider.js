import { useReducer } from "react";

import CollectionContext from "./collection-context";

const defaultCollectionState = {
    contract:null,
    totalSupply:null,
    collection:[],
    nftIsLoading:true,
}

const collectionReducer = (state,action)=>{
    if (action.type==="CONTRACT") {
        return{
            contract: action.contract,
            totalSupply: state.totalSupply,
            collection: state.collection,
            nftIsLoading: state.nftIsLoading
        }
    }

    if (action.type === "LOADSUPPLY") {
        return{
            contract: state.contract,
            totalSupply: action.totalSupply,
            collection:state.collection,
            nftIsLoading: state.nftIsLoading
        }
    }

    if (action.type === "LOADCOLLECTION") {
        return{
            contract: state.contract,
            totalSupply: state.totalSupply,
            collection : action.collection,
            nftIsLoading: state.nftIsLoading
        }
    }

    if (action.type === "UPDATESUPPLY") {
            return{
                contract: state.contract,
                totalSupply: action.totalSupply,
                collection:state.collection,
                nftIsLoading: state.nftIsLoading
            }
    }


    if (action.type === "UPDATECOLLECTION") {
        const index = state.collection.findIndex(NFT => NFT.id === parseInt(action.NFT.id));
        let collection= [];
        if (index === -1) {
            collection = [...state.collection,action.NFT];
        }else{
            collection = [...state.collection];
        }

        return{
            contract: state.contract,
            totalSupply: state.totalSupply,
            collection: collection,
            nftIsLoading: state.nftIsLoading
        }
    }

    if (action.type === "UPDATEOWNER") {
        const index = state.collection.findIndex(NFT => NFT.id === parseInt(action.NFT.id));
        let  collection = [...state.collection];
        
        if (index === -1) {
            return{
                contract: state.contract,
                totalSupply: state.totalSupply,
                collection: collection,
                nftIsLoading: state.nftIsLoading
            }
        }else{
            collection[index].owner = action.newOwner;
            return{
                contract: state.contract,
                totalSupply: state.totalSupply,
                collection: collection,
                nftIsLoading: state.nftIsLoading
            }
        }
        
    }

    if (action.type === "LOADING") {
        return{
            contract: state.contract,
            totalSupply: state.totalSupply,
            collection: state.collection,
            nftIsLoading: action.loading
        }
    }
    
    return defaultCollectionState;
}

const CollectionProvider = (props)=>{
    const [CollectionState,dispatchCollectionState] = useReducer(collectionReducer,defaultCollectionState);

    const loadContractHandler = async(web3,NFTCollection,deployedNetwork)=>{
        const contract = deployedNetwork? new web3.eth.Contract(NFTCollection.abi,deployedNetwork.address):'';
        dispatchCollectionState({contract:contract,type:"CONTRACT"});
        return contract;
    }

    const loadTotalSupplyHandler = async(contract)=>{
        const loadTotalSupply = await contract.methods.totalSupply().call();
        dispatchCollectionState({totalSupply:totalSupply,type:"LOADSUPPLY"});
        return loadTotalSupply;
    }

    const loadCollectionHandler = async(contract,totalSupply)=>{
        let collection = [];

        for (let i = 0; i < totalSupply; i++) {
            const hash = await contract.methods.tokenURIs(i).call();

            try {
                const response = await fetch(`https://ipfs.infura.io/ipfs/${hash}?clear`);
                if (!response.ok) {
                    throw new Error('Something went wrong');
                }

                const metadata = await  response.json();
                const owner = await contract.ownerOf(i+1).call();
                collection = [
                    ...collection,
                   {
                       id: i+1,
                       title: metadata.properties.name.description,
                       img: metadata.properties.image.description,
                       owner:owner
                   } 
                ]

            } catch (error) {
                console.error('Something went wrong');
            }

            dispatchCollectionState({collection:collection,type:"LOADCOLLECTION"});
        }
    }

    const updateCollectionHandler = async(contract,id,owner)=>{
        let NFT;
        const hash = await contract.methods.tokenURIs(id).call();

        try {
            const response = await fetch(`https://ipfs.infura.io/ipfs/${hash}?clear`);
            if (!response.ok) {
                throw new Error('Something went wrong');
            }

            const metadata = await response.json();
            NFT = {
                ...NFT,
                id: parseInt(id),
                title: metadata.properties.name.description,
                img: metadata.properties.image.description,
                owner:owner
            }
        } catch (error) {
            console.error('Something went wrong');
        }

        dispatchCollectionState({NFT:NFT,type:"UPDATECOLLECTION"});
    }

    const updateOwnerHandler = async(id,newOwner)=>{
        dispatchCollectionState({id:id,newOwner:newOwner,type:"UPDATEOWNER"});
    }

    const setNftIsLoadingHandler = async(loading)=>{
        dispatchCollectionState({loading:loading,type:"LOADING"});
    }

    const collectionContext = {
        contract: CollectionState.contract,
        totalSupply: CollectionState.totalSupply,
        collection: CollectionState.collection,
        loadContract: loadContractHandler,
        loadTotalSupply: loadTotalSupplyHandler,
        loadCollection: loadCollectionHandler,
        updateCollection: updateCollectionHandler,
        updateOwner: updateOwnerHandler,
        setNftIsLoading: setNftIsLoadingHandler,
        nftIsLoading: CollectionState.nftIsLoading
    }

    return(
        <CollectionContext.Provider value={collectionContext} >
            {props.children}
        </CollectionContext.Provider>
    );

};

export default CollectionProvider;