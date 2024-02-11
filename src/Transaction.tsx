import React from 'react';
import {alchemy} from './Config'
import type { TransactionReceipt } from '@ethersproject/abstract-provider';
import { useParams } from 'react-router-dom';

type TransactionParams = {
    txHash: string
}

export function Transaction(){

    const [txReceipt, setTxReceipt] = React.useState<TransactionReceipt>();
    const { txHash } = useParams<TransactionParams>();

    React.useEffect(() => {
        async function getTransactionData() {
  
            const transaction = await alchemy.transact.waitForTransaction(txHash)
            console.log(transaction)
            if(transaction){
                setTxReceipt(transaction)
            }
        }
      
        getTransactionData();
      });

    return (
        <div>
            <div className="App">Transaction Hash: {txReceipt?.transactionHash}</div>
            <div className="App">From: {txReceipt?.from}</div>
            <div className="App">To: {txReceipt?.to}</div>
            <div className="App">ContractAddress: {txReceipt?.contractAddress}</div>
            <div className="App">TransactionIndex: {txReceipt?.transactionIndex}</div>
            <div className="App">GasUsed: {txReceipt?.gasUsed.toString()}</div>
            <div className="App">BlockHash: {txReceipt?.blockHash}</div>
            <div className="App">BlockNumber: {txReceipt?.blockNumber}</div>
            <div className="App">Confirmations: {txReceipt?.confirmations}</div>
            <div className="App">CumulativeGasUsed: {txReceipt?.cumulativeGasUsed.toString()}</div>
            <div className="App">EffectiveGasPrice: {txReceipt?.effectiveGasPrice.toString()}</div>
            <div className="App">Type: {txReceipt?.type}</div>
            <table>
                <tbody>
                    <tr>
                    <th>LogIndex</th>
                    <th>Address</th>
                    <th>Data</th>
                    <th>Removed</th>
                    </tr>
                    {
                        txReceipt?.logs.map((txLog) => (
                        <tr key={txLog.logIndex}>            
                            <td>{txLog.logIndex}</td>
                            <td>{txLog.address}</td>
                            <td>{txLog.data}</td>
                            <td>{txLog.removed}</td>
                        </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
