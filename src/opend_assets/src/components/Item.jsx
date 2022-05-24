import React from "react";
import logo from "../../assets/logo.png";
import {Actor,HttpAgent} from '@dfinity/agent'
import {idlFactory} from "../../../declarations/nft"
import {Principal} from "@dfinity/principal"

function Item({id}) {
  const [name,setName] = React.useState();
  const [owner,setOwner] = React.useState();
  const [image,setImage] = React.useState();

  const localHost = "http://127.0.0.1:8000/"
  const agent = new HttpAgent({host:localHost});


  async function getOwner() {
    const NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: Principal.fromText(id)
    })

    const owner = await NFTActor.getOwner()
  
    setOwner(owner.toText())

  }



  

  async function getAsset() {
    const NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: Principal.fromText(id)
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
    canisterId: Principal.fromText(id)
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
        </div>
      </div>
    </div>
  );
}

export default Item;
