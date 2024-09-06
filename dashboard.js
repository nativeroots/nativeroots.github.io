document.addEventListener('DOMContentLoaded', function() {
    // Reuse the centralized renderTrackedAuctions function
    renderTrackedAuctions();
});

function renderTrackedAuctions() {
    const trackedAuctions = JSON.parse(localStorage.getItem('trackedAuctions') || '[]');
    const container = document.getElementById('trackedAuctionsContainer');
    
    if (trackedAuctions.length === 0) {
        container.innerHTML = '<p>You are not tracking any auctions.</p>';
        return;
    }

    container.innerHTML = trackedAuctions.map(auction => `
        <div class="tracked-auction" data-auction-id="${auction.id}">
            <img src="${auction.image}" alt="${auction.name}">
            <h3>${auction.name}</h3>
            <p>Current Price: ${auction.currentPrice}</p>
            <p>Time Left: ${auction.timeLeft}</p>
            <p>Leader: ${auction.leader}</p>
            <button class="btn untrack-auction" onclick="untrackAuction('${auction.id}')">Untrack Auction</button>
        </div>
    `).join('');
}

function untrackAuction(auctionId) {
    let trackedAuctions = JSON.parse(localStorage.getItem('trackedAuctions') || '[]');
    trackedAuctions = trackedAuctions.filter(auction => auction.id !== auctionId);
    localStorage.setItem('trackedAuctions', JSON.stringify(trackedAuctions));
    renderTrackedAuctions();
    notificationSystem.success('Auction untracked successfully!');
}

async function connectWallet() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            const userAddress = accounts[0];
            document.getElementById('walletAddress').innerText = truncateAddress(userAddress);
        } catch (error) {
            console.error(error);
            alert('Failed to connect wallet.');
        }
    } else {
        alert('No Ethereum wallet detected.');
    }
}

document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);