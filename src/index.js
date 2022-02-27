import "bootstrap/dist/css/bootstrap.css";
import ReactDOM from 'react-dom';

import Web3Provider from "../src/store/Web3Provider";
import CollectionProvider from "../src/store/CollectionProvider";
import MarketplaceProvider from "../src/store/MarketplaceProvider";

import App from './App';

ReactDOM.render(
  <Web3Provider>
    <CollectionProvider>
      <MarketplaceProvider>
        <App />
      </MarketplaceProvider>
    </CollectionProvider>
  </Web3Provider>, 
  document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

