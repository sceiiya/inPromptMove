module nft_launch_addr::sceii_nft {
    use std::signer;
    use std::string;
    // use std::string::{Self, String};
    use std::vector;

    use aptos_token_objects::aptos_token;
    use aptos_token_objects::collection;
    use aptos_framework::object::{Self, ExtendRef};
    use aptos_framework::timestamp;    
    use aptos_framework::event;    
    use aptos_std::smart_table::{Self, SmartTable};

    const ENOT_WHITELISTED: u64 = 0;
    
    //! laging tandaan,
    //! pag resource dapat wallet/user based sya // can only owned by one user at a time // immutable, can also transer but not at all times
    //! pag naman object, can own multiple instances // mostly 

    const COLLECTION_NAME: vector<u8> = b"Qbit Sceii";
    const COLLECTION_DESC: vector<u8> = b"I Am Atomic";
    const COLLECTION_URI: vector<u8> = b"https://github.com/sceiiya";

    #[event]
    struct WhitelistEvent has store, drop {
        user_addr: address,
        added: bool,
    }

    struct MintedNFT has store, drop, copy {
        nft_address: address,
        minter_address: address,
        minted_at: u64,
    }

    struct CollectionCreator has key {
      extend_ref: ExtendRef,
      whitelist: SmartTable<address, bool>,
      minted_nfts: vector<MintedNFT>
    }

    fun init_module(deployer: &signer){
      
      let creator_constructor_ref = &object::create_object(@nft_launch_addr);
      let extend_ref = object::generate_extend_ref(creator_constructor_ref);
      
      // let extend_ref = object::generate_extend_ref(&object::create_object(@nft_launch_addr));

      move_to(deployer, CollectionCreator {
        extend_ref,
        whitelist: smart_table::new<address, bool>(),
        minted_nfts: vector::empty<MintedNFT>(),
      });

      let creator_signer = &object::generate_signer(creator_constructor_ref);

      aptos_token::create_collection(
        // deployer,                                  // creator: &signer,
        creator_signer,                               // creator: &signer,
        string::utf8(COLLECTION_DESC),                // description: String,
        69,                                           // max_supply: u64,
        string::utf8(COLLECTION_NAME),                // name: String,
        string::utf8(COLLECTION_URI),                 // uri: String,
        true,                                         // mutable_description: bool,
        true,                                         // mutable_royalty: bool,
        true,                                         // mutable_uri: bool,
        true,                                         // mutable_token_description: bool,
        true,                                         // mutable_token_name: bool,
        true,                                         // mutable_token_properties: bool,
        true,                                         // mutable_token_uri: bool,
        true,                                         // tokens_burnable_by_creator: bool,
        true,                                         // tokens_freezable_by_creator: bool,
        1,                                            // royalty_numerator: u64,
        50                                            // royalty_denominator: u64,
      )
    }

    // public entry fun mint_nft(minter: &signer) : Object<AptosToken> acquires CollectionCreator {
    public entry fun mint_nft(minter: &signer) acquires CollectionCreator {
      let collection_creator = borrow_global_mut<CollectionCreator>(@nft_launch_addr); // Single mutable borrow
      assert!(smart_table::contains(&collection_creator.whitelist, signer::address_of(minter)), ENOT_WHITELISTED);

      let extend_ref = &collection_creator.extend_ref; // Use the existing reference
      let creator_signer = &object::generate_signer_for_extending(extend_ref);

      let nft = aptos_token::mint_token_object(
        creator_signer,
        string::utf8(COLLECTION_NAME),
        string::utf8(COLLECTION_DESC),
        string::utf8(COLLECTION_NAME),
        string::utf8(COLLECTION_URI),
        vector[],
        vector[],
        vector[],
    );

    let minter_addr = signer::address_of(minter);
    let nft_addr = object::object_address(&nft);

    vector::push_back(&mut collection_creator.minted_nfts, MintedNFT {
        nft_address: nft_addr,
        minter_address: minter_addr,
        minted_at: timestamp::now_seconds(),
    });

    object::transfer(creator_signer, nft, minter_addr);
}

    // function for demo so they can whitelist their self. next is to have a function where the deployer can only add adress to be whitelist
    // TODO: challenge for next is to add and set the price minting for the token and the limit of minting per user
    // TODO:  also, need to add a function where the deployer can remove the user from whitelist
    public entry fun add_self_to_whitelist(caller: &signer) acquires CollectionCreator {
      let caller_addr = signer::address_of(caller);
      let collection_creator = borrow_global_mut<CollectionCreator>(@nft_launch_addr);

      //? if whitelisted lang    
      if (!smart_table::contains(&collection_creator.whitelist, caller_addr)) {
        smart_table::upsert(&mut collection_creator.whitelist, caller_addr, true);
        event::emit(WhitelistEvent { user_addr: caller_addr, added: true });
      }
    }

    //? still not sure how to use this? from move spiders reference
    #[view]
    public fun collection_address(creator: address): address {
        collection::create_collection_address(&creator, &string::utf8(COLLECTION_NAME))
    }

    //? for site viewing
    #[view]
    public fun get_all_minted_nfts(): vector<MintedNFT> acquires CollectionCreator {
        let collection_creator = borrow_global_mut<CollectionCreator>(@nft_launch_addr);
        collection_creator.minted_nfts
    }

    //? for displaying ndt of user
    #[view]
    public fun get_nfts_by_address(minter_addr: address): vector<MintedNFT> acquires CollectionCreator {
        let collection_creator = borrow_global_mut<CollectionCreator>(@nft_launch_addr);
        let result = vector::empty<MintedNFT>();
        let i = 0;
        let len = vector::length(&collection_creator.minted_nfts);
        
        while (i < len) {
            let nft = vector::borrow(&collection_creator.minted_nfts, i);
            if (nft.minter_address == minter_addr) {
                vector::push_back(&mut result, *nft);
            };
            i = i + 1;
        };
        result
    }

    //! so there should be a checker where the user just connected their login, then chedck if the address inside whitelisted, if not then display unlisted and they should whitelist themselves
    #[view]
    public fun is_whitelisted(user_addr: address): bool acquires CollectionCreator {
        let collection_creator = borrow_global_mut<CollectionCreator>(@nft_launch_addr);
        smart_table::contains(&collection_creator.whitelist, user_addr) && 
        *smart_table::borrow(&collection_creator.whitelist, user_addr)
    }

    //? function to self remove and then actually
    public entry fun remove_self_from_whitelist(caller: &signer) acquires CollectionCreator {
        let caller_addr = signer::address_of(caller);
        let collection_creator = borrow_global_mut<CollectionCreator>(@nft_launch_addr);
        if (smart_table::contains(&collection_creator.whitelist, caller_addr)) {
        smart_table::remove(&mut collection_creator.whitelist, caller_addr);
        }
    }

    #[test_only]
    use std::debug;

        
    #[test(deployer = @nft_launch_addr, minter = @0x1, framework = @aptos_framework)]
    fun test_launch(deployer: signer, minter: signer, framework: signer) acquires CollectionCreator{
      timestamp::set_time_has_started_for_testing(&framework);
      init_module(&deployer);

      add_self_to_whitelist(&minter);
    
      mint_nft(&minter);
      // let this_minter = mint_token(&minter);

      let all_nfts = get_all_minted_nfts();
      debug::print(&all_nfts);

      let minter_nfts = get_nfts_by_address(@0x1);
      debug::print(&minter_nfts);

      let this_collection = collection_address(signer::address_of(&deployer));
      debug::print(&this_collection);
      // collection_address(signer::address_of(&deployer));
    }
}