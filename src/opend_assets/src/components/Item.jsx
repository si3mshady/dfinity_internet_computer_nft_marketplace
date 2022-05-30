import React from "react";
import logo from "../../assets/logo.png";
import {Actor,HttpAgent} from '@dfinity/agent'
import {idlFactory} from "../../../declarations/nft"
import {Principal} from "@dfinity/principal"
import Button from "./Button";

function Item({id}) {
  const [name,setName] = React.useState();
  const [owner,setOwner] = React.useState();
  const [image,setImage] = React.useState();
  const [button, setButton] = React.useState();
  const [priceInput,setPriceInput] = React.useState();

  const localHost = "http://127.0.0.1:8000"
  const agent = new HttpAgent({host:localHost});


  async function getOwner() {
    const NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id
    })

    const owner = await NFTActor.getOwner()
  
    setOwner(owner.toText())
    setButton(<Button text={"Sell"} handleClick={handleSell}/>)

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

const sellItem = async () => {
  console.log('Item sold for ' + price)
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
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
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
