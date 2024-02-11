import React from 'react';
import {alchemy} from './Config'
import { useParams, Link } from 'react-router-dom';
import { BigNumber, Utils } from 'alchemy-sdk';
import { GetNftsForOwnerOptions, NftFilters, OwnedNft, AssetTransfersCategory, AssetTransfersWithMetadataResult } from 'alchemy-sdk'

type AccountParams = {
    accountAddress: string
}


export function Account(){

    const { accountAddress } = useParams<AccountParams>();
    const [balance, setBalance] = React.useState<BigNumber>(BigNumber.from(0));
    const [nfts, setNfts] = React.useState<OwnedNft[]>([])
    const [nftPageKey, setNftPageKey] = React.useState<string>()
    const [nftDataShow, setNftDataShow] = React.useState<boolean>(true)

    const [transfers, setTransfers] = React.useState<AssetTransfersWithMetadataResult[]>([])
    const [transferPageKey, setTransferPageKey] = React.useState<string>()
    const [transferCategories, setTransferCategories] = React.useState<AssetTransfersCategory[]>([])

    React.useEffect(() => {
        async function getNFTData() {
            
            const options: GetNftsForOwnerOptions = {
                excludeFilters: [NftFilters.AIRDROPS],
                pageKey: nftPageKey
            };
            //Call the method to get the nfts owned by this address
            let response = await alchemy.nft.getNftsForOwner(accountAddress, options);
            console.log(response)
            setNfts([...nfts, ...response.ownedNfts])
            if(response.pageKey){
                setNftPageKey(response.pageKey)
            }            
        }      
        getNFTData();
      },[nftPageKey]);  

      React.useEffect(() => {
        async function getTransferData() {
            
            if(transferCategories.length > 0){
                let response = await alchemy.core.getAssetTransfers({
                    toAddress: accountAddress,
                    excludeZeroValue: true,
                    category: transferCategories,
                    withMetadata: true
                  })
                console.log(response)
                const transfersRes = []
                const lastYearDate = new Date(new Date().setFullYear(new Date().getFullYear() -1))
                for (const transfer of response.transfers){
                    if(new Date(transfer.metadata.blockTimestamp).getTime() > lastYearDate.getTime()){
                        transfersRes.push(transfer)
                    }
                }
                setTransfers([...transfers, ...transfersRes])
                if(response.pageKey){
                    setTransferPageKey(response.pageKey)
                }
            }
            
        }      
        getTransferData();
      },[transferPageKey, transferCategories]);       


    React.useEffect(() => {
        async function getAccountData() { 
            const balanceRes = await alchemy.core.getBalance(accountAddress, "latest")
            console.log(balanceRes)
            setBalance(balanceRes)
        }
      
        getAccountData();
      },[accountAddress]);    

      const handleNFTDataShowChange = () => {
        setNftDataShow(!nftDataShow);
      };

      const handleTransferTypeShowChange = (category: AssetTransfersCategory) => {
        if(!transferCategories.includes(category)){
            setTransferCategories([...transferCategories,category])
        }else{
            setTransferCategories(transferCategories.filter((transferCategory) => transferCategory !== category));
        }
        setTransfers([])
      };

      let nftCounter: number = 1;
      let transferCounter: number = 1;  
      return (
        <div>
            <div className="App">Account Address: {accountAddress}</div>
            <div className="App">Balance: {Utils.formatEther(balance)} ETH</div>
            <div className="App">NTFs
            <label>
                <input type="checkbox" checked={nftDataShow} onChange={handleNFTDataShowChange}/>
                show
            </label>
            
            </div>
            {
                nftDataShow &&
                <table>
                <tbody>
                    <tr>
                        <th>Index</th>
                        <th>Contract Address</th>
                        <th>Token ID</th>
                        <th>Includes Image</th>
                    </tr>
                    {
                        
                        nfts.map((nft) => (
                        <tr key={nft.contract.address+nft.tokenId}>
                            <td><Link to={`/nft/${nft.contract.address}/${nft.tokenId}`}>{nftCounter++}</Link></td>          
                            <td>{nft.contract.address}</td>
                            <td>{nft.tokenId}</td>
                            <td><input type="checkbox" checked={nft.rawMetadata?.image !== undefined} readOnly/></td>
                        </tr>
                        ))
                    }
                </tbody>
            </table>
            }
            <div className="App">Last Year's Transfers
            <label>
                <input type="checkbox" checked={transferCategories.includes(AssetTransfersCategory.ERC20)} onChange={()=>handleTransferTypeShowChange(AssetTransfersCategory.ERC20)}/>
                ERC20
            </label>
            <label>
                <input type="checkbox" checked={transferCategories.includes(AssetTransfersCategory.ERC721)} onChange={()=>handleTransferTypeShowChange(AssetTransfersCategory.ERC721)}/>
                ERC721
            </label>
            <label>
                <input type="checkbox" checked={transferCategories.includes(AssetTransfersCategory.ERC1155)} onChange={()=>handleTransferTypeShowChange(AssetTransfersCategory.ERC1155)}/>
                ERC1155
            </label>                        
            </div>
            {
                transferCategories.length > 0 &&
                <table>
                <tbody>
                    <tr>
                        <th>Date</th>
                        <th>From</th>
                        <th>Asset</th>
                        <th>Category</th>
                        <th>BlockNum</th>
                        <th>Value</th>
                        <th>TokenID</th>
                    </tr>
                    {
                        
                        transfers.map((transfer) => (
                        <tr key={transferCounter++}>
                            <td>{transfer.metadata.blockTimestamp}</td>          
                            <td>{transfer.from}</td>
                            <td>{transfer.asset}</td>
                            <td>{transfer.category}</td>
                            <td><Link to={`/block/${parseInt(transfer.blockNum, 16)}`}>{parseInt(transfer.blockNum, 16)}</Link></td>
                            <td>{transfer.value}</td>
                            <td>{transfer.tokenId}</td>
                        </tr>
                        ))
                    }
                </tbody>
            </table>
            }
        </div>    
    )
}