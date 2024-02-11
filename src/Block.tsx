import React from 'react';
import {alchemy} from './Config'
import type { TransactionResponse } from '@ethersproject/abstract-provider';
import { useParams, Link } from 'react-router-dom';

type BlockParams = {
    blockNumberParam: string
}

export function Block(){

    const [gasUsed, setGasUsed] = React.useState<string>();
    const [blockTransactions, setBlockTransactions] = React.useState<TransactionResponse[]>([])

    const { blockNumberParam } = useParams<BlockParams>();
    const blockNumber = Number(blockNumberParam)

    React.useEffect(() => {
        async function getBlockData() {
  
            const block = await alchemy.core.getBlockWithTransactions(blockNumber)
            console.log(block)                
            setGasUsed(block.gasUsed.toString())                
            setBlockTransactions(block.transactions)        
        }
      
        getBlockData();
      });

    return (
        <div>
            <div className="App">Block Number: {blockNumber}</div>
            <div className="App">Gas Used: {gasUsed}</div>
            <div className="App">Transactions</div>
            <table>
                <tbody>
                    <tr>
                    <th>Hash</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Value</th>
                    </tr>
                    {
                        blockTransactions.map((blockTransaction) => (
                        <tr key={blockTransaction.hash}>            
                            <td><Link to={`/transaction/${blockTransaction.hash}`}>{blockTransaction.hash}</Link></td>
                            <td>{blockTransaction.from}</td>
                            <td>{blockTransaction.to}</td>
                            <td>{blockTransaction.value.toString()}</td>
                        </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}


