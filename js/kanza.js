// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add to Cart Functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            
            addToCart(productName, productPrice, productCard);
        });
    });
    
    // Wishlist Buttons
    const wishlistButtons = document.querySelectorAll('.wishlist-btn');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            
            if (this.classList.contains('active')) {
                icon.classList.remove('far', 'fa-heart');
                icon.classList.add('fas', 'fa-heart', 'text-danger');
                showNotification('تمت إضافة المنتج إلى المفضلة');
            } else {
                icon.classList.remove('fas', 'fa-heart', 'text-danger');
                icon.classList.add('far', 'fa-heart');
                showNotification('تمت إزالة المنتج من المفضلة');
            }
        });
    });
    
    // Quick View Buttons
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            
            showQuickView(productName);
        });
    });
    
    // Compare Buttons
    const compareButtons = document.querySelectorAll('.compare-btn');
    
    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            showNotification('تمت إضافة المنتج للمقارنة');
        });
    });
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const agreeCheck = this.querySelector('#agreeCheck');
            
            if (!emailInput.value) {
                showNotification('يرجى إدخال البريد الإلكتروني', 'error');
                return;
            }
            
            if (!agreeCheck.checked) {
                showNotification('يرجى الموافقة على تلقي الرسائل الإخبارية', 'error');
                return;
            }
            
            // Simulate subscription
            showNotification('شكراً لك! تم الاشتراك في النشرة الإخبارية بنجاح');
            emailInput.value = '';
            agreeCheck.checked = false;
        });
    }
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Cart functionality
    const cartCloseButtons = document.querySelectorAll('.cart-item .btn-close');
    
    cartCloseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            cartItem.remove();
            updateCartCount();
            showNotification('تمت إزالة المنتج من السلة');
        });
    });
});

function addToCart(productName, productPrice, productCard) {
    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        let currentCount = parseInt(cartCount.textContent);
        cartCount.textContent = currentCount + 1;
        
        // Add animation
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);
    }
    
    // Add to cart dropdown
    const cartItems = document.querySelector('.cart-items');
    if (cartItems) {
        const productImg = productCard.querySelector('img').src;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item d-flex align-items-center mb-3';
        cartItem.innerHTML = `
            <img src="${productImg}" alt="${productName}" width="60">
            <div class="ms-3">
                <h6 class="mb-0">${productName}</h6>
                <small class="text-muted">1 × ${productPrice}</small>
            </div>
            <button class="btn-close ms-auto"></button>
        `;
        
        cartItems.appendChild(cartItem);
        
        // Add event listener to new close button
        cartItem.querySelector('.btn-close').addEventListener('click', function() {
            cartItem.remove();
            updateCartCount();
            showNotification('تمت إزالة المنتج من السلة');
        });
    }
    
    // Show success notification
    showNotification(`تمت إضافة ${productName} إلى سلة التسوق`);
    
    // Add button animation
    const addButton = productCard.querySelector('.add-to-cart');
    addButton.innerHTML = '<i class="fas fa-check me-1"></i> تمت الإضافة';
    addButton.classList.remove('btn-success');
    addButton.classList.add('btn-secondary');
    
    setTimeout(() => {
        addButton.innerHTML = '<i class="fas fa-cart-plus me-1"></i> أضف للسلة';
        addButton.classList.remove('btn-secondary');
        addButton.classList.add('btn-success');
    }, 2000);
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cartItems = document.querySelectorAll('.cart-item');
        cartCount.textContent = cartItems.length;
    }
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'error' ? 'danger' : 'success'} position-fixed`;
    notification.style.cssText = `
        top: 20px;
        left: 20px;
        right: 20px;
        max-width: 400px;
        margin: 0 auto;
        z-index: 9999;
        animation: slideDown 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    `;
    
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'} me-3"></i>
            <div class="flex-grow-1">${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
    
    // Add close button functionality
    notification.querySelector('.btn-close').addEventListener('click', function() {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

function showQuickView(productName) {
    // Create quick view modal
    const modalHTML = `
        <div class="modal fade" id="quickViewModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${productName}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img src="https://via.placeholder.com/400x400" class="img-fluid rounded" alt="${productName}">
                            </div>
                            <div class="col-md-6">
                                <h3 class="mb-3">${productName}</h3>
                                <div class="mb-3">
                                    <span class="text-success fw-bold fs-4">150 ج.م</span>
                                    <del class="text-muted ms-2">180 ج.م</del>
                                </div>
                                <div class="mb-4">
                                    <div class="product-rating mb-2">
                                        <i class="fas fa-star text-warning"></i>
                                        <i class="fas fa-star text-warning"></i>
                                        <i class="fas fa-star text-warning"></i>
                                        <i class="fas fa-star text-warning"></i>
                                        <i class="fas fa-star-half-alt text-warning"></i>
                                        <span class="text-muted small">(15 تقييم)</span>
                                    </div>
                                </div>
                                <p class="mb-4">وصف المنتج: هذا المنتج عالي الجودة ومثالي للاستخدام الزراعي. تم تصنيعه وفق أعلى المعايير العالمية.</p>
                                
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-2">
                                        <span class="me-3">الكمية:</span>
                                        <div class="quantity-input">
                                            <button class="btn btn-sm btn-outline-secondary">-</button>
                                            <input type="number" value="1" min="1" class="form-control form-control-sm text-center mx-2" style="width: 70px;">
                                            <button class="btn btn-sm btn-outline-secondary">+</button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="d-grid gap-2">
                                    <button class="btn btn-success btn-lg">
                                        <i class="fas fa-cart-plus me-2"></i> أضف إلى السلة
                                    </button>
                                    <button class="btn btn-outline-success btn-lg">
                                        <i class="far fa-heart me-2"></i> أضف إلى المفضلة
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    modal.show();
    
    // Remove modal after close
    document.getElementById('quickViewModal').addEventListener('hidden.bs.modal', function() {
        modalContainer.remove();
    });
    
    // Add quantity functionality
    const modalElement = document.getElementById('quickViewModal');
    modalElement.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-outline-secondary')) {
            const input = modalElement.querySelector('input[type="number"]');
            let value = parseInt(input.value);
            
            if (e.target.textContent === '+') {
                input.value = value + 1;
            } else if (e.target.textContent === '-' && value > 1) {
                input.value = value - 1;
            }
        }
    });
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-100%);
            opacity: 0;
        }
    }
    
    .quantity-input {
        display: flex;
        align-items: center;
    }
    
    .quantity-input input {
        max-width: 70px;
    }
`;
document.head.appendChild(style);







// في نهاية ملف script.js
$(document).ready(function(){
    // Categories Slider
    $('.categories-slider').owlCarousel({
        loop: true,
        margin: 25,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1,
                margin: 15
            },
            576: {
                items: 2,
                margin: 20
            },
            768: {
                items: 3,
                margin: 20
            },
            992: {
                items: 3,
                margin: 35
            },
            1200: {
                items: 4,
                margin: 25
            }
        },
        rtl: true
    });
    
    // Custom navigation
    $('.slider-next').click(function() {
        $('.categories-slider').trigger('next.owl.carousel');
        $(this).find('i').css('transform', 'translateX(-5px)');
        setTimeout(() => {
            $(this).find('i').css('transform', 'translateX(0)');
        }, 200);
    });
    
    $('.slider-prev').click(function() {
        $('.categories-slider').trigger('prev.owl.carousel');
        $(this).find('i').css('transform', 'translateX(5px)');
        setTimeout(() => {
            $(this).find('i').css('transform', 'translateX(0)');
        }, 200);
    });
    
    // Mega menu hover
    $('.mega-dropdown').hover(function() {
        $(this).find('.mega-menu').addClass('show');
    }, function() {
        $(this).find('.mega-menu').removeClass('show');
    });
});