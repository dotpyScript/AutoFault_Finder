//  <!-- Scripts -->
// Function to open the edit modal and populate it with code data
$(document).ready(function () {
  $(".edit-btn").on("click", function () {
    const codeId = $(this).data("id");

    // Fetch the code data using AJAX
    $.ajax({
      url: `/getCode/${codeId}`, // Adjust this endpoint to fetch the code data
      type: "GET",
      success: function (data) {
        // Populate the form with the fetched data
        $("#codeId").val(data._id);
        $("#editCode").val(data.code);
        $("#editDescription").val(data.description);
        $("#editPossibleCauses").val(data.possibleCauses);
        $("#editSuggestedFixes").val(data.suggestedFixes);

        // Show the modal
        $("#modalCenter").modal("show");
      },
      error: function (error) {
        Toastify({
          text: "Error fetching code details",
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

// /// Edit Code
// Function to confirm the edit before submission
function confirmEdit() {
  $("#confirmModal").modal("show"); // Show confirmation modal
}

// Handle form submission after confirmation
$("#confirmSaveBtn").click(function () {
  const formData = $("#editCodeForm").serialize();
  const codeId = $("#codeId").val(); // Get the code ID from the hidden input

  $.ajax({
    url: `/editCode/${codeId}`, // Endpoint to handle code updates
    type: "POST",
    data: formData,
    success: function (response) {
      // Close the modals
      $("#modalCenter").modal("hide");
      $("#confirmModal").modal("hide");
      // Show the "Please Wait" modal
      $("#pleaseWaitModal").modal("show");

      // Optionally, refresh the page or update the table with the new data
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
        location.reload();
      }, 2500);
    },
    error: function (error) {
      Toastify({
        text: "Error updating code",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        close: true,
      }).showToast();
    },
  });
});

// Making an AJAX request to fetch the list of codes
$.ajax({
  url: "/listCode", // URL to your route
  method: "GET",
  success: function (response) {
    // handle response
  },
  error: function (response) {
    // Handle the error response and show with Toastify
    const errorMessage =
      response.responseJSON.message || "Something went wrong!";
    Toastify({
      text: errorMessage,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
      close: true,
    }).showToast();
  },
});

// /// Handle Delete
let codeIdToDelete;
// Variable to store the code ID to delete

// Handle delete button click
$(".delete-btn").click(function () {
  codeIdToDelete = $(this).data("id"); // Get the ID of the code to delete
  $("#deleteModal").modal("show"); // Show the confirmation modal
});

// Handle confirmation button click
$("#confirmDeleteBtn").click(function () {
  if (codeIdToDelete) {
    // Send AJAX DELETE request
    $.ajax({
      url: `/codes/${codeIdToDelete}`,
      type: "DELETE",
      success: function (response) {
        // Optionally remove the deleted code's row from the table
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
          // $(`tr[data-id="${codeIdToDelete}"]`).remove();
          location.reload();
        }, 2500);

        // Hide the modal after successful deletion
        $("#deleteModal").modal("hide");
      },
      error: function (response) {
        // Show error message with Toastify
        Toastify({
          text: response.responseJSON.message,
          duration: 3000,
          gravity: "top",
          position: "right",
          backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
          close: true,
        }).showToast();
      },
    });
  }
});

// Handling the click event for viewing the code
$(".view-code-btn").click(function (e) {
  e.preventDefault();

  const codeId = $(this).data("id");

  $.ajax({
    url: `/view/${codeId}`,
    type: "GET",
    success: function (response) {
      Toastify({
        text: "Please wait! Redirecting...",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        close: true,
      }).showToast();

      // Redirect after 3 seconds to allow the toast notification to display
      setTimeout(function () {
        window.location.href = response.redirect;
      }, 2000);
    },
    error: function (xhr) {
      // Check if the error is a 404 (code not found)
      let errorMessage = "Error loading code details.";
      if (xhr.status === 404) {
        errorMessage = "Code not found.";
      }

      Toastify({
        text: errorMessage,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        close: true,
      }).showToast();
    },
  });
});

// Seatch Tables
// <!-- search table 2 Script -->

$("#search").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#table tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});
