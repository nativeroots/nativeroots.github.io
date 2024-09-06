import AuctionModule from './modules/AuctionModule.js';
import DashboardModule from './modules/DashboardModule.js';

document.addEventListener('DOMContentLoaded', function() {
    AuctionModule.init();
    DashboardModule.init();
    window.initializeTracking(); // Initialize the tracking functionality
});
