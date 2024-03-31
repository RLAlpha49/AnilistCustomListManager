// Function to load an image when the sidebar is expanded
export function loadImage(id) {
  const img = document.getElementById(id);
  if (img && !img.src) {
    img.src = img.dataset.src;
  }
}

// Function to load the images when the sidebar is expanded
export function loadImages() {
  loadImage('github-icon');
  loadImage('kofi-icon');
  // Add more calls to loadImage for the other images
}

document.addEventListener('DOMContentLoaded', function() {
  // Get the sidebar element
  const sidebar = document.querySelector('.sidebar');

  // Create a MutationObserver instance
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // If the class list has changed and it includes 'expanded', load the images
      if (mutation.attributeName === 'class' && sidebar.classList.contains('expanded')) {
        loadImages();
      }
    });
  });

  // Start observing the sidebar for changes to its class list
  observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
});