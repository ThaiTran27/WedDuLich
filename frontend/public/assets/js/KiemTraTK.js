$(document).ready(function () {
  // Lấy thông tin user từ localStorage
  let user = JSON.parse(localStorage.getItem("user"));
  if (user != null) {
    $("#btn_dangnhap").hide();
    $("#user_name").html("Xin chào, " + user.ten);
  } else {
    $("#user_name").hide();
  }
});
