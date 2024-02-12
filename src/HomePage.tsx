import React from 'react'
import { Link } from 'react-router-dom'
import {alchemy} from './Config'
import { AlchemySubscription } from 'alchemy-sdk'

export function HomePage() {
    const maxBlocks = 10;
    const [blockNumbers, setBlockNumbers] = React.useState<number []>([]);

    const [accountAddress, setAccountAddress] = React.useState<string>()

    const maxTransactions = 20;
    const [transactions, setTransactions] = React.useState<string []>([])

    const blockNumbersRef = React.useRef<number []>([])
    blockNumbersRef.current = blockNumbers

    const transactionsRef = React.useRef<string []>([])
    transactionsRef.current = transactions

    const didBlockInitRef = React.useRef<boolean>(false);

    const didPendingTransactionsInitRef = React.useRef<boolean>(false);

    React.useEffect(()=> {
      if (!didBlockInitRef.current) {
        didBlockInitRef.current = true
        console.log("useEffect block init"+maxBlocks)
        alchemy.ws.on("block", (blockNumber) => {
          console.log("Latest block:", blockNumber)
          let blockNumbers = blockNumbersRef.current
          console.log("Latest blocks:", blockNumbers)
          if(maxBlocks === blockNumbers.length){
            blockNumbers = [...blockNumbers.slice(1), blockNumber]
          }else{
            blockNumbers = [...blockNumbers, blockNumber]
          }
          setBlockNumbers(blockNumbers)      
        },);
      }     

    },[maxBlocks])
      
    
    React.useEffect(()=> {
      if(!didPendingTransactionsInitRef.current){
        didPendingTransactionsInitRef.current = true
        console.log("useEffect pending transactions init"+maxTransactions)        
        alchemy.ws.on(
          {
            method: AlchemySubscription.PENDING_TRANSACTIONS,
          },
          (tx) => {
            //console.log(tx)
            let transactions = transactionsRef.current
            if(maxTransactions === transactions.length){
              transactions = [...transactions.slice(1), tx.hash];
            }else{
              transactions = [...transactions, tx.hash];
            }
            setTransactions(transactions);
          }
        );
      }

      
    },[maxTransactions])    

    function handleSubmit(event : React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        console.log(accountAddress)
        window.open(`/account/${accountAddress}`)
    }

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        setAccountAddress(value);
      }    

    return (
      <div className="App">
        Welcome to the Ethereum blockchain explorer!
        <div >Account Search:</div>
        <form onSubmit={handleSubmit} className="App">
            <input name="accountAddress" onChange={handleInputChange}/>
            <button type="submit">Search</button>
        </form>
        <div className="left-component"> Latest Blocks
          {
            blockNumbers.map((blockNumber) => (
              <div className="App" key={blockNumber}>
              <Link to={`block/${blockNumber}`}>Block Number: {blockNumber}</Link>
              </div>
            ))                    
          }
        </div>
        <div className="right-component"> Pending Transactions
          {
            transactions.map((txHash) => (
              <div className="App" key={txHash}>
              <Link to={`transaction/${txHash}`}>{txHash}</Link>
              </div>
            ))                    
          }
        </div>
        
      </div>
    );    
}
