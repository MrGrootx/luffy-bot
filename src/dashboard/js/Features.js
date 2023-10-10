document.addEventListener("DOMContentLoaded", function() {
    // Get the Features link element
    const featuresLink = document.getElementById("featuresLink");

    // Add a click event listener to the Features link
    featuresLink.addEventListener("click", function(event) {
        console.log("Features link clicked");
      event.preventDefault(); // Prevent the default behavior of the link
      window.location.href = "./Features.html"; // Redirect to Features.html
    });
  });