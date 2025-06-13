## iPM <inPromtMove> A fiverr-like system in web3 aptos ecosystem

WIP

<!-- contract/module @[Contract Url](https://explorer.aptoslabs.com/account/0x3c7f3d73782bc44477a7c21e166a3c1714da72dc0e7eda23d95068c33886f4ac/modules/packages/sceii_nft?network=testnet) -->

___
#### (MVP Checklist) Features:
 - [x] Can connect petra wallet on testnet
 - [x] can register as a user
 - [ ] can see 'ongoing campaigns' and 'publish gigs' tabs
 - [ ] (option) can mint an nft upon registering as a user detailng their membership to the ecosystem
 - [x] can publish gigs as an employer
 - [x] can post a sumission to the gig
 - [ ] gig publisher can choose submitted output to choose from the limit
 - [ ] approval of the output are notified by ¹`email?` ²`events?`
 - [ ] ongoing gigs are shown

#### Supported Features Checklist
- [ ] implementation and usage of ¹`stable coin` or ²`aptos coin` in gigs
- [ ] escrow automation of transfer of funds to the chosen gig output submitted
- [ ] signed by a custodial wallet from the system to say that it is verified by the system and the approval is done within the system
- [ ] 

___
## Breakdowns
#### Contract Checklist
- [x] initialize account as a user
- [x] can add a gig description
- [x] can get a gig details to submit
- [x] can submit a work in an active gig
- [ ] can choose a work to be declared as a winner
- [ ] give the bounty to the winner

#### UI/Integrations Checklist
- [x] initialize account as a user
- [x] can add a gig description
- [x] can get a gig details to submit
- [x] can submit a work in an active gig
- [ ] can choose a work to be declared as a winner
- [ ] consume indexer to get updated events

#### Backend
- [ ] integrate UI I/O api
- [ ] consume api to put description
- [ ] put the documents/images in an IPFS
- [ ] integrate database for profile

#### UX Improvement Checklist
- [ ] design UI
- [ ] put the alerts in toaster
- [ ] loading ui if loading data


### [Deployed:](https://explorer.aptoslabs.com/txn/0x1cfbaec82b9f43be297ce5d6e01975df96893f40a44364bd8a8993c68635ba46?network=testnet)

## [See and interact with DApp](https://in-prompt-move.vercel.app)