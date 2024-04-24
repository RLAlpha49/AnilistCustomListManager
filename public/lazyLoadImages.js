/* eslint-disable no-redeclare */
/* global IntersectionObserver, MutationObserver */

// Initialize variables
let isRunning = false
let checkImagesInterval = null

// Wait for the window to load
window.onload = function () {
  // If already running, exit
  if (isRunning) return
  // Set running flag
  isRunning = true
  // Get the container element to observe for changes
  const targetNode = document.querySelector('.center-container')

  // Configuration for MutationObserver
  const config = { childList: true }

  // Callback function for MutationObserver
  const callback = function (mutationsList) {
    // Loop through mutations
    for (const mutation of mutationsList) {
      // Check if the type of mutation is childList
      if (mutation.type === 'childList') {
        // Clear interval for checking images
        clearInterval(checkImagesInterval)
        // Set interval to check for lazy images
        checkImagesInterval = setInterval(function () {
          // Get all lazy images
          const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'))

          // If there are lazy images
          if (lazyImages.length > 0) {
            // Clear interval
            clearInterval(checkImagesInterval)

            // If IntersectionObserver is supported
            if ('IntersectionObserver' in window) {
              // Create IntersectionObserver
              const lazyImageObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                  // If image is intersecting with viewport
                  if (entry.isIntersecting) {
                    // Load the image
                    const lazyImage = entry.target
                    lazyImage.src = lazyImage.dataset.src
                    // Remove 'lazy' class
                    lazyImage.classList.remove('lazy')
                    // Stop observing
                    lazyImageObserver.unobserve(lazyImage)
                  }
                })
              })

              // Observe each lazy image
              lazyImages.forEach(function (lazyImage) {
                lazyImageObserver.observe(lazyImage)
              })
            }
          }
        }, 250)
        // Reset running flag
        isRunning = false
      }
    }
  }

  // Create MutationObserver
  const observer = new MutationObserver(callback)

  // Observe the target node (center-container) for changes
  observer.observe(targetNode, config)
}
