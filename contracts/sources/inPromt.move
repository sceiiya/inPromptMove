module inPromptMove_addr::inPromptMove001 {
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
    
    //! laging tandaan,
    //! pag resource dapat wallet/user based sya // can only owned by one user at a time // immutable, can also transer but not at all times
    //! pag naman object, can own multiple instances // mostly 

    #[event]
    struct OngoingGigEvent has store, drop {
        user_addr: address,
        ongoing: bool,
    }


    struct GigsVault has key {
      extend_ref: ExtendRef,
    }

    fun init_module(deployer: &signer){
      
      let creator_constructor_ref = &object::create_object(@inPromptMove_addr);
      let extend_ref = object::generate_extend_ref(creator_constructor_ref);
      
      // let extend_ref = object::generate_extend_ref(&object::create_object(@inPromptMove_addr));

      move_to(deployer, GigsVault {
        extend_ref,
      });

      let creator_signer = &object::generate_signer(creator_constructor_ref);


    }

    #[test_only]
    use std::debug;

        
    #[test(deployer = @inPromptMove_addr, minter = @0x1, framework = @aptos_framework)]
    fun test_launch(deployer: signer, minter: signer, framework: signer) acquires GigsVault{
      timestamp::set_time_has_started_for_testing(&framework);
      init_module(&deployer);

    }
}