import React from "react";
import logo from "../../assets/logo.png";
import {Actor,HttpAgent} from '@dfinity/agent'
import {idlFactory} from "../../../declarations/nft"
import {Principal} from "@dfinity/principal"
import Button from "./Button";
import {opend} from "../../../declarations/opend";
import CURRENT_USER_ID from "../index";
import PriceLabel from "./PriceLabel";

function Item({id, role}) {
  const [name,setName] = React.useState();
  const [owner,setOwner] = React.useState();
  const [image,setImage] = React.useState();
  const [button, setButton] = React.useState();
  const [priceInput,setPriceInput] = React.useState();
  const [loading, setLoadingHidden] = React.useState(true)
  const [blur, setBlur] = React.useState()
  const [sellStatus,setSellStatus] = React.useState('')
  const [priceLabel, setPriceLabel] = React.useState('')

  const localHost = "http://127.0.0.1:8000"
  const agent = new HttpAgent({host:localHost});
  // when testing locally use the fetch rootkey method. remove when deploying liv
  agent.fetchRootKey()


  let NFTActor; 
  async function getOwner() {
     NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id
    })

    const owner = await NFTActor.getOwner()
  
    setOwner(owner.toText())

    if (role == 'collection') {
      const isListed = await opend.isListed(id)
  
      if (isListed) {
        setBlur({filter: "blur(4px)"})
        setOwner("OpenD Marketplace")
        setSellStatus("Listed!")
      }
      else {
        setButton(<Button text={"Sell"} handleClick={handleSell}/>)
      }
     } else if (role == 'discover') {
       const originalOwner = await opend.getOriginalOwner(id)
       if (originalOwner.toText() != CURRENT_USER_ID.toText()) {
        setButton(<Button text={"Buy"} handleClick={handleBuy}/>)



       }


       const price = await opend.getListedNftPrice(id)
       setPriceLabel(<PriceLabel sellPrice={price.toString()}/>)
     
     }
    

  }

let price;
const handleSell = () => {
  console.log("Sell Clicked")
  setPriceInput(<input
    placeholder="Price in DANG"
    type="number"
    className="price-input"
    value={price}
    onChange={(e) => {price=e.target.value}}
  />)

  setButton(<Button text={"Confirm"} handleClick={sellItem}/>)
}

const handleBuy = async () => {
  console.log('Buying!!')
}

const sellItem = async () => {
  setBlur({filter: "blur(10px)"})
  setLoadingHidden(false)
  console.log('Item sold for ' + price)
  const listing = await opend.listItem(id, Number(price))
  console.log('listing result:' + listing)

  if (listing === "Success") {
    let canisterID = await opend.getOpenDCanisterID()
    const transferResult = await NFTActor.transferOwnership(canisterID)

    console.log("transfer result: "  + transferResult)
    if (transferResult == "Success") {
      setLoadingHidden(true)
      setButton()
      setPriceInput()
      setOwner("OpenD Marketplace")
      setSellStatus("Listed!")
    }
    else {
      setLoadingHidden(true)
    }

  }

 
}

  async function getAsset() {
    const NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id
    })

    const image_data = await NFTActor.getAsset()
    const imageContent = new Uint8Array(image_data)
    const image = URL.createObjectURL(
      new Blob([imageContent.buffer], {type: "image/png"})

    )

    setImage(image)
  }
  



async function loadNft() {
  const NFTActor = await Actor.createActor(idlFactory, {
    agent,
    canisterId: id
  })


  const name = await NFTActor.getName()
  setName(name)

}

React.useEffect(() => {

loadNft()
getOwner()
getAsset()

}, [])


  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
         <div hidden={loading} className="lds-ellipsis">

                <div></div>
                <div></div>
                <div></div>
                <div></div>

          </div>

        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
