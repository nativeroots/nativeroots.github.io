let userAddress = null;

// Initialize Web3 and Wallet
async function initWeb3() {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAddress = accounts[0];
            localStorage.setItem('userWallet', userAddress);
            updateWalletUI(userAddress);
            setupDropdown();
        } catch (error) {
            console.error('User denied account access', error);
            showError('Please connect to your wallet to proceed.');
        }
    } else {
        alert('MetaMask is not installed. Please install it to connect your wallet.');
    }
}

// Connect Wallet
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = accounts[0];
            localStorage.setItem('userWallet', userAddress);
            updateWalletUI(userAddress);
        } catch (error) {
            console.error('User rejected the connection', error);
            showError('Connection to wallet was rejected.');
        }
    } else {
        showError('No wallet detected. Please install MetaMask.');
    }
}

// Update Wallet UI
function updateWalletUI(address) {
    const walletAddress = document.getElementById('walletAddress');
    if (address) {
        walletAddress.textContent = `${address.slice(0, 6)}...${address.slice(-4)}`;
    } else {
        walletAddress.textContent = 'Connect Wallet';
    }
}

// Setup the Dropdown for Wallet Options
function setupDropdown() {
    const walletAddress = document.getElementById('walletAddress');
    const walletDropdown = document.getElementById('walletDropdown');
    const disconnectWallet = document.getElementById('disconnectWallet');

    walletAddress.addEventListener('click', function () {
        if (walletAddress.textContent === 'Connect Wallet') {
            connectWallet();
        } else {
            walletDropdown.classList.toggle('show');
        }
    });

    disconnectWallet.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.removeItem('userWallet');
        updateWalletUI(null);
        walletDropdown.classList.remove('show');
    });

    window.onclick = function (event) {
        if (!event.target.matches('.wallet-address')) {
            if (walletDropdown.classList.contains('show')) {
                walletDropdown.classList.remove('show');
            }
        }
    };
}

// Display Error Messages
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
    setTimeout(() => errorElement.remove(), 5000);
}

// Initialize the wallet on page load
document.addEventListener('DOMContentLoaded', function () {
    const storedWallet = localStorage.getItem('userWallet');
    if (storedWallet) {
        userAddress = storedWallet;
        updateWalletUI(userAddress);
    }
    setupDropdown();
    initWeb3();
});

// Getter for userAddress
function getUserAddress() {
    return userAddress;
}

// Optionally, expose functions globally
window.connectWallet = connectWallet;
window.getUserAddress = getUserAddress;
