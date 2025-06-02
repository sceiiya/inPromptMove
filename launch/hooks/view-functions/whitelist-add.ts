import {
    Account,
    Aptos,
    AptosConfig,
    Network,
} from "@aptos-labs/ts-sdk";
 
export async function AddToWhitelist() {
    let sender = Account.generate();
    let receiver = Account.generate();
 
    // 0. Setup the client and test accounts
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);
 
    await aptos.fundAccount({
        accountAddress: sender.accountAddress,
        amount: 100_000_000,
    });
 
    // 1. Build the transaction to preview the impact of it
    const transaction = await aptos.transaction.build.simple({
        sender: sender.accountAddress,
        data: {
        // All transactions on Aptos are implemented via smart contracts.
        function: "0x1::aptos_account::transfer",
        functionArguments: [receiver.accountAddress, 100],
        },
    });
 
    // 2. Simulate to see what would happen if we execute this transaction
    const [userTransactionResponse] = await aptos.transaction.simulate.simple({
        signerPublicKey: sender.publicKey,
        transaction,
    });
    console.log(userTransactionResponse)
 
    // If the fee looks ok, continue to signing!
    // ...
}
