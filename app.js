angular.module('giftGenius', [])
.controller('GiftController', function($scope) {
    // Theme Management
    $scope.darkMode = false;
    $scope.toggleTheme = function() {
        $scope.darkMode = !$scope.darkMode;
    };

    // Form Steps
    $scope.currentStep = 1;
    $scope.nextStep = function() {
        if ($scope.currentStep < 3) $scope.currentStep++;
    };
    $scope.prevStep = function() {
        if ($scope.currentStep > 1) $scope.currentStep--;
    };

    // Recipient Data
    $scope.recipient = {
        name: '',
        relationship: ''
    };

    // Occasions
    $scope.occasions = [
        'Birthday', 'Anniversary', 'Wedding', 'Graduation', 
        'Valentine\'s Day', 'Christmas', 'Mother\'s Day', 'Father\'s Day',
        'Baby Shower', 'Housewarming', 'Retirement', 'Just Because'
    ];
    $scope.selectedOccasion = '';
    $scope.selectOccasion = function(occasion) {
        $scope.selectedOccasion = occasion;
    };
    $scope.getOccasionIcon = function(occasion) {
        const icons = {
            'Birthday': 'fa-birthday-cake',
            'Anniversary': 'fa-heart',
            'Wedding': 'fa-ring',
            'Graduation': 'fa-graduation-cap',
            'Valentine\'s Day': 'fa-heart',
            'Christmas': 'fa-holly-berry',
            'Mother\'s Day': 'fa-female',
            'Father\'s Day': 'fa-male',
            'Baby Shower': 'fa-baby',
            'Housewarming': 'fa-home',
            'Retirement': 'fa-umbrella-beach',
            'Just Because': 'fa-gift'
        };
        return icons[occasion] || 'fa-gift';
    };

    // Interests
    $scope.allTags = [
        'Technology', 'Books', 'Fitness', 'Cooking', 'Travel',
        'Music', 'Art', 'Fashion', 'Photography', 'Gardening',
        'Sports', 'Movies', 'Gaming', 'Crafts', 'Pets',
        'Outdoors', 'Wine', 'DIY', 'Beauty', 'Collecting'
    ];
    $scope.selectedTags = [];
    $scope.toggleTag = function(tag) {
        const index = $scope.selectedTags.indexOf(tag);
        if (index === -1) {
            $scope.selectedTags.push(tag);
        } else {
            $scope.selectedTags.splice(index, 1);
        }
    };

    // Budget
    $scope.budgets = ['<$20', '$20-$50', '$50-$100', '$100-$250', '$250+'];
    $scope.budgetIndex = 2; // Default to $50-$100
    $scope.additionalNotes = '';

    // Gift Suggestions
    $scope.suggestions = [];
    $scope.hasMoreSuggestions = true;
    $scope.showMindMap = false;
    $scope.sortOption = 'match';
    
    // Sample gift data
    const sampleGifts = [ /* your gift data remains unchanged */ 
        // (The gift array you posted is unchanged, so it's omitted here for brevity)
    ];

    $scope.generateSuggestions = function() {
        let filteredGifts = sampleGifts;
        if ($scope.selectedTags.length > 0) {
            filteredGifts = sampleGifts.filter(gift => 
                $scope.selectedTags.some(tag => gift.tags.includes(tag))
            );
        }
        $scope.suggestions = filteredGifts.slice(0, 6);
        $scope.hasMoreSuggestions = filteredGifts.length > 6;
    };

    $scope.loadMore = function() {
        const currentLength = $scope.suggestions.length;
        let filteredGifts = sampleGifts;
        if ($scope.selectedTags.length > 0) {
            filteredGifts = sampleGifts.filter(gift => 
                $scope.selectedTags.some(tag => gift.tags.includes(tag))
            );
        }
        const moreGifts = filteredGifts.slice(currentLength, currentLength + 3);
        $scope.suggestions = $scope.suggestions.concat(moreGifts);
        $scope.hasMoreSuggestions = currentLength + moreGifts.length < filteredGifts.length;
    };

    $scope.sortSuggestions = function() {
        switch($scope.sortOption) {
            case 'priceLow':
                $scope.suggestions.sort((a, b) => 
                    parseFloat(a.price.replace(/[^0-9.]/g, '')) - 
                    parseFloat(b.price.replace(/[^0-9.]/g, ''))
                );
                break;
            case 'priceHigh':
                $scope.suggestions.sort((a, b) => 
                    parseFloat(b.price.replace(/[^0-9.]/g, '')) - 
                    parseFloat(a.price.replace(/[^0-9.]/g, ''))
                );
                break;
            case 'popular':
                $scope.suggestions.sort((a, b) => 
                    (b.rating * 20 + b.reviews) - (a.rating * 20 + a.reviews)
                );
                break;
            case 'eco':
                $scope.suggestions.sort((a, b) => 
                    (b.ecoFriendly === true) - (a.ecoFriendly === true)
                );
                break;
            default: // match
                $scope.suggestions.sort((a, b) => b.matchScore - a.matchScore);
        }
    };

    // Mind Map
    $scope.mindMapCategories = [
        { name: 'Books', icon: 'fa-book' },
        { name: 'Technology', icon: 'fa-laptop' },
        { name: 'Experiences', icon: 'fa-ticket-alt' },
        { name: 'Fashion', icon: 'fa-tshirt' },
        { name: 'Home', icon: 'fa-home' }
    ];

    $scope.getGiftsForCategory = function(category) {
        return $scope.suggestions.filter(gift => 
            gift.tags.includes(category)).slice(0, 3);
    };

    $scope.getNodePosition = function(index) {
        const angle = (index / $scope.mindMapCategories.length) * Math.PI * 2;
        const radius = 150;
        return {
            left: `calc(50% + ${Math.cos(angle) * radius}px)`,
            top: `calc(50% + ${Math.sin(angle) * radius}px)`
        };
    };

    $scope.toggleView = function(showMap) {
        $scope.showMindMap = showMap;
    };

    // Gift Details
    $scope.selectedGift = null;
    $scope.viewDetails = function(gift) {
        $scope.selectedGift = gift;
    };

    $scope.rateGift = function(id, type) {
        const gift = $scope.suggestions.find(g => g.id === id);
        if (gift) {
            if (type === 'like') {
                gift.likes = (gift.likes || 0) + 1;
            } else {
                gift.dislikes = (gift.dislikes || 0) + 1;
            }
        }
    };

    $scope.saveForLater = function(gift) {
        alert(`Saved "${gift.name}" to your favorites!`);
    };

    $scope.shareGift = function(gift) {
        alert(`Sharing "${gift.name}" with friends!`);
    };

    $scope.getScoreColor = function(score) {
        if (score >= 90) return '#00b894';
        if (score >= 75) return '#00cec9';
        if (score >= 60) return '#0984e3';
        if (score >= 40) return '#fdcb6e';
        return '#ff7675';
    };

    $scope.reset = function() {
        $scope.currentStep = 1;
        $scope.recipient = { name: '', relationship: '' };
        $scope.selectedOccasion = '';
        $scope.selectedTags = [];
        $scope.budgetIndex = 2;
        $scope.additionalNotes = '';
        $scope.suggestions = [];
        $scope.selectedGift = null;
        $scope.showMindMap = false;
    };
});
