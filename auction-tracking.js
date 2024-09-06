// Centralized Auction Tracking Module
function toggleTrackedAuction(auctionId, auctionName, currentPrice, image, timeLeft, leader) {
    let trackedAuctions = JSON.parse(localStorage.getItem('trackedAuctions')) || [];
    const index = trackedAuctions.findIndex(auction => auction.id === auctionId);
    
    if (index === -1) {
        trackedAuctions.push({
            id: auctionId,
            name: auctionName,
            currentPrice: currentPrice,
            image: image,
            timeLeft: timeLeft,
            leader: leader
        });
        localStorage.setItem('trackedAuctions', JSON.stringify(trackedAuctions));
        showConfirmation(`Auction "${auctionName}" has been tracked.`);
    } else {
        trackedAuctions.splice(index, 1);
        localStorage.setItem('trackedAuctions', JSON.stringify(trackedAuctions));
        showConfirmation(`Auction "${auctionName}" has been untracked.`);
    }
    
    updateTrackButtons();
    renderTrackedAuctions();
}

function updateTrackButtons() {
    const trackButtons = document.querySelectorAll('.track-auction');
    const trackedAuctions = JSON.parse(localStorage.getItem('trackedAuctions')) || [];
    
    trackButtons.forEach(button => {
        const auctionId = button.getAttribute('data-auction-id');
        const isTracked = trackedAuctions.some(auction => auction.id === auctionId);
        button.textContent = isTracked ? 'Untrack Auction' : 'Track Auction';
        button.classList.toggle('tracked', isTracked);
    });
}

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

function showConfirmation(message) {
    const confirmationElement = document.createElement('div');
    confirmationElement.className = 'confirmation-message';
    confirmationElement.textContent = message;
    document.body.appendChild(confirmationElement);
    setTimeout(() => {
        confirmationElement.remove();
    }, 3000);  // Display for 3 seconds
}

function updateCountdowns() {
    const countdowns = document.querySelectorAll('.countdown');
    countdowns.forEach(countdown => {
        let [hours, minutes, seconds] = countdown.textContent.split(':').map(Number);
        if (seconds > 0) {
            seconds--;
        } else if (minutes > 0) {
            minutes--;
            seconds = 59;
        } else if (hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
        }
        countdown.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    });
}

document.addEventListener('DOMContentLoaded', function() {
    renderTrackedAuctions();
    updateTrackButtons();
    setInterval(updateCountdowns, 1000); // Update countdowns every second
});

// Example usage of getUserAddress
function someFunction() {
    const address = getUserAddress();
    if (address) {
        // Use the wallet address
    } else {
        // Prompt the user to connect their wallet
    }
}
