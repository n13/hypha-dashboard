import { JsonRpc } from 'eosjs';

const accountInfo = document.getElementById('account-info');

// Parse the URL to get the account name
const urlParams = new URLSearchParams(window.location.search);
const accountName = urlParams.get('account');

async function fetchLockedUpTokens() {
    try {
        // Initialize EOSJS with the Telos EOSIO endpoint URL
        const rpc = new JsonRpc('https://mainnet.telos.net');

        // Replace 'vestng.hypha' with your contract account name and 'locks' with your table name
        const response = await rpc.get_table_rows({
            json: true,
            code: 'vestng.hypha',
            scope: 'vestng.hypha',
            table: 'locks',
            index_position: 2,
            key_type: 'name',
            lower_bound: accountName,
            upper_bound: accountName,
        });

        // res: {
        //     "rows": [
        //       {
        //         "lock_id": 0,
        //         "owner": "illumination",
        //         "tier_id": "launch",
        //         "amount": "2.00 HYPHA",
        //         "claimed_amount": "0.00 HYPHA",
        //         "note": "bdc51c7d17c6a2afcba1e4ff8551c83d10ae340499fe4a362d5133d29f41b9fa"
        //       },
        // ...


        console.log("locks for " + accountName);
        console.log("res: " + JSON.stringify(response, null, 2));

        // Extract and display the locked-up token information
        const lockedUpTokens = response.rows[0]; // Adjust this based on your contract structure
        accountInfo.innerHTML = `<p>Account: ${accountName}</p>`;
        accountInfo.innerHTML += `<p>Locked Up Tokens: ${lockedUpTokens}</p>`;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call the function to fetch and display locked-up tokens
fetchLockedUpTokens();
