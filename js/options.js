$(document).ready(function () {

    localStorage["username"] == null ? localStorage["username"] = '' : localStorage["username"];

    var username = localStorage["username"];

    $('#save').click(function () {

        username = $('#username').val();
        $(".alert").remove();
        if (username != '') {
          localStorage["username"] = username;
          $(".content").prepend("<p class=\"alert success\">Successfully saved!</p>");
        } else {
          $(".content").prepend("<p class=\"alert warning\">Enter your username</p>");
        }

    });

    $('#username').val(localStorage["username"]);

});
