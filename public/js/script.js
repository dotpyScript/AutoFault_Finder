function alertifying(formId, route) {
  $(`#${formId}`).submit(function (e) {
    e.preventDefault();
    const formData = $(this).serialize();

    $.post(`/${route}`, formData, function (response) {
      $("#pleaseWaitModal").modal("show");
      setTimeout(() => {
        $("#pleaseWaitModal").modal("hide");
        Toastify({
          text: "Code updated successfully",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
          close: true,
        }).showToast();
      }, 2000);

      setTimeout(() => {
        window.location.href = response.redirect;
      }, 2500);
    }).fail(function (response) {
      const errors = response.responseJSON.errors;

      if (errors) {
        errors.forEach((error) => {
          Toastify({
            text: error, // Show error messages
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            close: true,
          }).showToast();
        });
      } else {
        Toastify({
          text: response.responseJSON.message, // Handle server errors
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          close: true,
        }).showToast();
      }
    });
  });
}

// search queries
$(document).ready(function () {
  // Handle search form submission
  $("#searchForm").on("submit", function (e) {
    e.preventDefault(); // Prevent form from submitting normally

    const query = $("#searchQuery").val(); // Get the search query

    if (!query) {
      Toastify({
        text: "Please enter a search query",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        close: true,
      }).showToast();
      return;
    }

    // AJAX call to search route
    $.ajax({
      url: "/search", // URL for the search route
      type: "GET",
      data: { query }, // Send the query as a parameter
      success: function (response) {
        if (response.success) {
          // Success message with Toastify
          Toastify({
            text: "Code found! Redirecting...",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            close: true,
          }).showToast();

          // Redirect to the viewCode page
          setTimeout(function () {
            window.location.href = `/viewCode/${response.code._id}`;
          }, 3000);
        } else {
          // No match found
          Toastify({
            text: response.message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            close: true,
          }).showToast();
        }
      },
      error: function () {
        // Error message with Toastify
        Toastify({
          text: "An error occurred while searching. Please try again.",
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          close: true,
        }).showToast();
      },
    });
  });
});
