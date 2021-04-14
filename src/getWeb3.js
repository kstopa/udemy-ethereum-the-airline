import Web3 from 'web3';

// Get projects version of web3 instead of Metamask default.
const getWeb3 = () => {
    return new Promise((resolve, reject) => {
        window.addEventListener('load', function() {
            let web3 = window.web3;

            if (typeof web3 !== 'undefined') {
                console.log(web3.currentProvider);
                web3 = new Web3(web3.currentProvider);
                resolve(web3);
            } else {
                console.error('Provider not found please install Metamask from https://metamask.io');
                reject()
            }
        })
    })
}

export default getWeb3; 

