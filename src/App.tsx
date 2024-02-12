import React from 'react';
import './App.css';
import {Block} from './Block'
import {Transaction} from './Transaction'
import {HomePage} from './HomePage'
import {Account} from './Account'
import {NFT} from './NFT'
import { Route, Switch } from 'react-router-dom'

const App = () => {

  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/block/:blockNumberParam" component={Block} />
      <Route exact path="/transaction/:txHash" component={Transaction} />
      <Route exact path="/account/:accountAddress" component={Account} />
      <Route exact path="/nft/:contractAddress/:tokenId" component={NFT} />
    </Switch>
  )
}

export default App;
