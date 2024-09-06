// User authentication and wallet connection
document.addEventListener('DOMContentLoaded', async function() {
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        const contractAddress = "your_contract_address";
        const contractABI = [...] // ABI from the smart contract

        const auctionContract = new web3.eth.Contract(contractABI, contractAddress);

        const connectWalletBtn = document.getElementById('connectWalletBtn');
        if (connectWalletBtn) {
            connectWalletBtn.addEventListener('click', async function() {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const userAddress = accounts[0];
                localStorage.setItem('userWallet', userAddress);
                updateWalletUI(userAddress);
            });
        }

        // Other initializations...

        const walletAddress = document.getElementById('walletAddress');
        const walletDropdown = document.getElementById('walletDropdown');
        const disconnectWallet = document.getElementById('disconnectWallet');
        
        // Toggle dropdown when wallet address is clicked
        walletAddress.addEventListener('click', function() {
            walletDropdown.classList.toggle('show');
        });

        // Disconnect wallet logic
        disconnectWallet.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('userWallet');
            updateWalletUI(null);  // Reset wallet UI
            walletDropdown.classList.remove('show');
        });

        // Hide dropdown when clicking outside
        window.addEventListener('click', function(event) {
            if (!event.target.matches('.wallet-address')) {
                if (walletDropdown.classList.contains('show')) {
                    walletDropdown.classList.remove('show');
                }
            }
        });

        // Function to update wallet UI
        function updateWalletUI(address) {
            if (address) {
                walletAddress.textContent = `${address.slice(0, 6)}...${address.slice(-4)}`;
            } else {
                walletAddress.textContent = 'Connect Wallet';
            }
        }

        // Load stored wallet if available
        const storedWallet = localStorage.getItem('userWallet');
        if (storedWallet) {
            updateWalletUI(storedWallet);
        }
    } else {
        alert("MetaMask is not installed. Please install it to connect your wallet.");
    }
});

async function connectWallet() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const userAddress = accounts[0];
            localStorage.setItem('userWallet', userAddress);
            updateWalletUI(userAddress);
            // Send wallet address to server
            await updateUserWallet(userAddress);
        } catch (error) {
            console.error("Failed to connect wallet:", error);
            alert("Failed to connect wallet. Please try again.");
        }
    } else {
        alert("MetaMask is not installed. Please install it to connect your wallet.");
    }
}

async function fetchUserData() {
    // Mock user data for testing
    return {
        username: 'TestUser',
        walletConnected: false
    };
}

function updateUserAuthUI(user) {
    const userAuthDiv = document.querySelector('.user-auth');
    if (user) {
        userAuthDiv.innerHTML = `
            <div class="dropdown">
                <button class="dropbtn">
                    Welcome, ${user.username} ▼
                </button>
                <div class="dropdown-content">
                    <a href="/dashboard">Dashboard</a>
                    <a href="/profile">Profile</a>
                    <a href="/logout">Logout</a>
                </div>
            </div>
            ${!user.walletConnected ? '<button id="connectWalletBtn" class="connect-wallet-button">Connect Wallet</button>' : ''}
        `;
    } else {
        userAuthDiv.innerHTML = `
            <a href="/login" class="login-button">Login</a>
            <a href="/register" class="register-button">Register</a>
            <button id="connectWalletBtn" class="connect-wallet-button">Connect Wallet</button>
        `;
    }
}

function updateWalletUI(walletAddress) {
    const walletAddressElement = document.getElementById('walletAddress');
    if (walletAddressElement) {
        if (walletAddress) {
            walletAddressElement.textContent = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
            walletAddressElement.classList.add('connected');
        } else {
            walletAddressElement.textContent = 'Connect Wallet';
            walletAddressElement.classList.remove('connected');
        }
    }
}

async function updateUserWallet(walletAddress) {
    try {
        const response = await fetch('/api/update-wallet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ walletAddress }),
        });
        if (!response.ok) {
            throw new Error('Failed to update wallet on server');
        }
    } catch (error) {
        console.error("Error updating wallet on server:", error);
        alert("Failed to update wallet on server. Please try again.");
    }
}

const MAX_BID = 0.1; // ETH (constant maximum bid)
let currentBid = 0.073;
let countdownTime = 600; // 10 minutes in seconds
let lastBidTime = Date.now();
const BID_LIMIT = 0.1; // Bid limit of 0.1 ETH
let lastBidder = '';

function updateBidInfo() {
    document.getElementById('current-bid-amount').textContent = currentBid.toFixed(4) + ' ETH';
    document.getElementById('max-bid').textContent = MAX_BID.toFixed(3) + ' ETH';
}

function updateCountdown() {
    let now = Date.now();
    if (currentBid < BID_LIMIT && now - lastBidTime > 5000 && Math.random() < 0.3) {
        simulateBid();
    }

    let minutes = Math.floor(countdownTime / 60);
    let seconds = countdownTime % 60;
    document.getElementById('countdown').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    if (countdownTime > 0) {
        countdownTime--;
        setTimeout(updateCountdown, 1000);
    } else {
        document.getElementById('countdown').textContent = "Auction Ended";
    }
}

function simulateBid() {
    if (currentBid >= BID_LIMIT) return;
    
    let bidIncrease = 0.0001 + Math.random() * 0.001;
    currentBid = Math.min(currentBid + bidIncrease, BID_LIMIT);
    lastBidTime = Date.now();
    
    // Reset timer to 10 seconds if bid is placed in last 10 seconds
    if (countdownTime <= 10) {
        countdownTime = 10;
    }
    
    updateBidInfo();
    updateRecentBids();
}

function updateRecentBids() {
    const bidderNames = [
        'SatoshisFan', 'ETHMiner', 'HODLer4Life', 'CryptoKing', 
        'BlockchainQueen', 'DeFiWizard', 'TokenTrader', 'NFTCollector',
        'MoonShot', 'DiamondHands', 'AltcoinGuru', 'BitcoinMaxi',
        'ChainLinkMarine', 'DogeWhisperer', 'YieldFarmer', 'GasFeeHater'
    ];
    
    let newBidder;
    do {
        newBidder = bidderNames[Math.floor(Math.random() * bidderNames.length)];
    } while (newBidder === lastBidder);
    
    lastBidder = newBidder;

    const bidsList = document.getElementById('recent-bids');
    const newBid = document.createElement('li');
    newBid.textContent = `${currentBid.toFixed(4)} ETH - ${newBidder}`;
    bidsList.insertBefore(newBid, bidsList.firstChild);
    document.getElementById('highest-bidder-name').textContent = newBidder;
}

// Load tracked auctions from localStorage
let trackedAuctions = JSON.parse(localStorage.getItem('trackedAuctions')) || [];

function renderTrackedAuctions() {
    const trackedAuctionsContainer = document.getElementById('trackedAuctions');
    if (trackedAuctionsContainer) {
        trackedAuctionsContainer.innerHTML = '';
        const trackedAuctions = JSON.parse(localStorage.getItem('trackedAuctions') || '[]');
        if (trackedAuctions.length > 0) {
            trackedAuctions.forEach(auction => {
                if (auction && auction.id && auction.name) {
                    const auctionElement = document.createElement('div');
                    auctionElement.className = 'auction-item';
                    auctionElement.innerHTML = `
                        <img src="${auction.image || 'placeholder.jpg'}" alt="${auction.name}">
                        <div class="auction-details">
                            <h3>${auction.name}</h3>
                            <p class="price">Current Price: ${auction.currentPrice || 'N/A'}</p>
                            <p class="time-left">Time Left: ${auction.timeLeft || 'N/A'}</p>
                            <p class="leader">Leader: ${auction.leader || 'No leader'}</p>
                        </div>
                        <button class="btn btn-danger" onclick="untrackAuction('${auction.id}')">Untrack</button>
                    `;
                    trackedAuctionsContainer.appendChild(auctionElement);
                }
            });
        } else {
            trackedAuctionsContainer.innerHTML = '<p class="no-auctions">No tracked auctions yet.</p>';
        }
    }
}

function untrackAuction(auctionId) {
    if (confirm(`Are you sure you want to untrack this auction?`)) {
        let trackedAuctions = JSON.parse(localStorage.getItem('trackedAuctions') || '[]');
        const auctionToRemove = trackedAuctions.find(auction => auction.id === auctionId);
        trackedAuctions = trackedAuctions.filter(auction => auction.id !== auctionId);
        localStorage.setItem('trackedAuctions', JSON.stringify(trackedAuctions));
        renderTrackedAuctions();
        showConfirmation(`Auction "${auctionToRemove?.name || 'Unknown'}" has been untracked.`);
    }
}

function showConfirmation(message) {
    const confirmationElement = document.createElement('div');
    confirmationElement.className = 'confirmation-message';
    confirmationElement.textContent = message;
    document.body.appendChild(confirmationElement);
    setTimeout(() => {
        confirmationElement.remove();
    }, 3000);
}

// Call renderTrackedAuctions when the page loads
document.addEventListener('DOMContentLoaded', renderTrackedAuctions);

// Update the track-auction-btn event listener
const trackAuctionBtn = document.getElementById('track-auction-btn');
if (trackAuctionBtn) {
    trackAuctionBtn.addEventListener('click', () => {
        trackAuction('current-auction-id', 'Current Auction', currentBid, 'placeholder.jpg', '00:10', 'Unknown');
    });
}

// Remove or comment out this line
// alert('Auction tracked! You will receive notifications about this auction.');

// Initialize
updateBidInfo();
updateCountdown();

// Add event listeners for buttons
document.getElementById('place-bid-btn').addEventListener('click', simulateNewBidder);
document.getElementById('track-auction-btn').addEventListener('click', () => {
    trackAuction('current-auction-id', 'Current Auction', currentBid, 'placeholder.jpg', '00:10', 'Unknown');
});

document.addEventListener('DOMContentLoaded', function() {
    const collapsibles = document.querySelectorAll('.collapsible-header');
    
    collapsibles.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.display === 'block') {
                content.style.display = 'none';
                this.querySelector('.toggle-icon').textContent = '+';
            } else {
                content.style.display = 'block';
                this.querySelector('.toggle-icon').textContent = '-';
            }
        });
    });
});

// Update this function
function updateTrackButtons() {
    const trackButtons = document.querySelectorAll('.track-auction');
    const trackedAuctions = JSON.parse(localStorage.getItem('trackedAuctions') || '[]');
    
    trackButtons.forEach(button => {
        const auctionId = button.getAttribute('data-auction-id');
        const isTracked = trackedAuctions.some(auction => auction.id === auctionId);
        button.textContent = isTracked ? 'Untrack Auction' : 'Track Auction';
        button.classList.toggle('tracked', isTracked);
    });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    updateTrackButtons();
    
    // Add event listeners to track buttons
    document.querySelectorAll('.track-auction').forEach(button => {
        button.addEventListener('click', function() {
            const auctionItem = this.closest('.auction-item');
            const auctionId = auctionItem.getAttribute('data-auction-id');
            const auctionName = auctionItem.querySelector('h3').textContent;
            const currentPrice = auctionItem.querySelector('.current-price').textContent;
            const image = auctionItem.querySelector('img').src;
            const timeLeft = auctionItem.querySelector('.countdown').textContent;
            const leader = auctionItem.querySelector('.leader-name').textContent;

            if (typeof window.toggleTrackedAuction === 'function') {
                window.toggleTrackedAuction(auctionId, auctionName, currentPrice, image, timeLeft, leader);
            } else {
                console.error('toggleTrackedAuction function not found in global scope');
            }
        });
    });
});

// ... (keep the rest of the existing code)
