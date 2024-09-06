// Bid Module
const BidModule = (function() {
    let currentBid = 0;
    let maxBid = 0;
    let autoBidEnabled = false;
    let autoBidIncrement = 0;

    function showBidModal(auctionId, currentPrice, auctionName) {
        currentBid = parseFloat(currentPrice);
        maxBid = currentBid * 1.5; // Set max bid to 150% of current price
        
        const modal = document.getElementById('bidModal');
        const bidModalAuctionName = document.getElementById('bidModalAuctionName');
        const bidModalCurrentPrice = document.getElementById('bidModalCurrentPrice');
        const bidAmountInput = document.getElementById('bidAmount');
        
        bidModalAuctionName.textContent = auctionName;
        bidModalCurrentPrice.textContent = currentPrice;
        bidAmountInput.min = currentBid + 0.01;
        bidAmountInput.value = (currentBid + 0.01).toFixed(2);
        
        modal.style.display = 'block';
    }

    function closeBidModal() {
        const modal = document.getElementById('bidModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function placeBid(auctionId) {
        const bidAmount = parseFloat(document.getElementById('bidAmount').value);
        if (bidAmount > currentBid && bidAmount <= maxBid) {
            // Here you would typically send a request to your backend API
            // For now, we'll just update the UI
            currentBid = bidAmount;
            document.getElementById('current-bid-amount').textContent = currentBid.toFixed(3) + ' ETH';
            closeBidModal();
            alert('Bid placed successfully!');
        } else {
            alert('Invalid bid amount. Please enter a value between ' + (currentBid + 0.01).toFixed(3) + ' and ' + maxBid.toFixed(3));
        }
    }

    return {
        showBidModal: showBidModal,
        closeBidModal: closeBidModal,
        placeBid: placeBid
    };
})();

// Export the module if using ES6 modules
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = BidModule;
}