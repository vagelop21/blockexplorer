import React from 'react';
import {alchemy} from './Config'
import { Nft, FloorPriceMarketplace } from 'alchemy-sdk'
import { useParams } from 'react-router-dom';

type NFTParams = {
    contractAddress: string,
    tokenId: string
}

export function NFT(){

    const [ nft, setNft ] = React.useState<Nft>()
    const [ imageUrl, setImageUrl] = React.useState<string>()
    const [ floorPrices, setFloorPrices] = React.useState<string[]>([])

    function hasFloorPriceData(floorPriceMarket: FloorPriceMarketplace): floorPriceMarket is FloorPriceMarketplace{
        return floorPriceMarket.floorPrice !== undefined && floorPriceMarket.priceCurrency !==undefined
    }

    const { contractAddress, tokenId } = useParams<NFTParams>();
    React.useEffect(() => {
        async function getNFTMetadata() {
  
            let response = await alchemy.nft.getNftMetadata(contractAddress, tokenId, {});

            // logging the response to the console
            console.log(response)
            setNft(response)
            
            if(response.rawMetadata?.image){
                if(response.rawMetadata?.image.includes("http")){
                    setImageUrl(response.rawMetadata?.image)
                }else{
                    setImageUrl("https://ipfs.io/ipfs/"+response.rawMetadata.image.split("//")[1])
                }
            }

            const floorPricesInfo: string[] = []

            const floorPriceRes = await alchemy.nft.getFloorPrice(contractAddress)
            const openSeaFloorPriceMarket: FloorPriceMarketplace = floorPriceRes?.openSea as FloorPriceMarketplace
            if(hasFloorPriceData(openSeaFloorPriceMarket)){
                const openSeaFloorPrice = openSeaFloorPriceMarket.floorPrice + " " + openSeaFloorPriceMarket.priceCurrency + " (OpenSea)"
                floorPricesInfo.push(openSeaFloorPrice)
            }
            
            const looksRareFloorPriceMarket: FloorPriceMarketplace = floorPriceRes?.looksRare as FloorPriceMarketplace
            if(hasFloorPriceData(looksRareFloorPriceMarket)){
                const looksRareFloorPrice = looksRareFloorPriceMarket.floorPrice + " " + looksRareFloorPriceMarket.priceCurrency + " (LooksRare)" 
                floorPricesInfo.push(looksRareFloorPrice)
            }
            if(floorPricesInfo.length > 0){
                setFloorPrices(floorPricesInfo)
            }
            
        }
      
        getNFTMetadata();
      },[]);

    return (
    <div className="App">
        <div>NFT Info</div>
        <div>Contract Address: {contractAddress}</div>
        <div>TokenId: {tokenId}</div>
        <div>Symbol: {nft?.contract.symbol}</div>
        <div>Token Type: {nft?.contract.tokenType}</div>
        <div>Floor Price: {floorPrices.join(" / ")}</div>
        <img src={imageUrl}/>
        <div>{nft?.rawMetadata?.description}</div>
    </div>)
}