import Cycles "mo:base/ExperimentalCycles";
import Debug "mo:base/Debug";
import NFTActorClass "../NFT/nft";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import List "mo:base/List";

actor OpenD {

  private type Listing {
    itemOwner: Principal;
    itemPrice: Nat;
  };

  var mapOfNFTs = HashMap.HashMap<Principal, NFTActorClass.NFT>(1, Principal.equal, Principal.hash);
  var mapOfOwners = HashMap.HashMap<Principal, List.List<Principal>>(1,Principal.equal, Principal.hash);
  var mapOfListings = HashMap.HashMap<Principal, Listing>(1,Principal.equal, Principal.hash);

    public shared(msg) func mint(imgData: [Nat8], name: Text) : async Principal {
      let owner : Principal = msg.caller;

      Debug.print(debug_show(Cycles.balance()));
      Cycles.add(100_500_000_000);
      let newNFT = await NFTActorClass.NFT(name, owner, imgData);
      Debug.print(debug_show(Cycles.balance()));

      let newNFTPrincipal = await newNFT.getCanisterId();
      mapOfNFTs.put(newNFTPrincipal, newNFT);
      addToOwnershipMap(owner, newNFTPrincipal); 



      return newNFTPrincipal

    };


    private func addToOwnershipMap(owner: Principal, nftId: Principal) {
      // Motoko option -> must use switch statement 
      // what happens when null is returned, what happens when there is a value 
        var ownedNFTList : List.List<Principal> = switch (mapOfOwners.get(owner)) {

          case null List.nil<Principal>();
          case (?result) result;

        };

        //principal:list => datatypes below
        ownedNFTList := List.push(nftId, ownedNFTList);  
        mapOfOwners.put(owner,ownedNFTList);
    };


    public query func getOwnedNfts(user: Principal) : async [Principal] {

      var userNftListing : List.List<Principal> = switch (mapOfOwners.get(user)) {
        case null List.nil<Principal>();
        case (?result) result;

      };

      return List.toArray(userNftListing);

    }

    public shared(msg) func listItem(id: Principal, price: Nat): async Text {
    var item: NFTActorClass.NFT = switch (mapOfListings.get(id)) {
      case null return "NFT does not exist.";
      case(?result) result;
    };

    return "Success";
    };
};
