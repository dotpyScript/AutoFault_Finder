function alertifying(formId, route) {
  $(`#${formId}`).submit(function (e) {
    e.preventDefault();
    const formData = $(this).serialize();

    $.post(`/${route}`, formData, function (response) {
      // Correctly using response.message
      Toastify({
        text: response.message, // Make sure you're using the correct field from the response
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        close: true,
      }).showToast();

      // Show the "Please Wait" modal
      $("#pleaseWaitModal").modal("show");
      // Redirect based on user role after 5 seconds
      setTimeout(function () {
        // Show the "Please Wait" modal
        $("#pleaseWaitModal").modal("hide");
        window.location.href = response.redirect; // Redirect to admin dashboard
      }, 3000); // Delay of 5 seconds (3000ms)
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
