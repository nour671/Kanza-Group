document.addEventListener('DOMContentLoaded', () => {

    const images = document.querySelectorAll('img');

    images.forEach(img => {


        if (
            img.closest('.hero') ||
            img.closest('.slider') ||
            img.classList.contains('no-lazy')
        ) {
            img.loading = 'eager';
            return;
        }


        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        } 
        // fallback
        else {
            lazyLoadFallback(img);
        }
    });
});

function lazyLoadFallback(img) {

    const src = img.src;
    if (!src) return;

    img.removeAttribute('src');
    img.dataset.src = src;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                image.src = image.dataset.src;
                observer.unobserve(image);
            }
        });
    });

    observer.observe(img);
}
