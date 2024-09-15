const handlerFunction = async (fcmToken, title, body, dataConten) => {
  try {
    console.log(fcmToken, "hahhahhh");
    if (fcmToken && fcmToken.length > 0) {
      console.log("Token hợp lệ:", fcmToken);
      console.log("Tiêu đề:", title);
      console.log("Nội dung:", body);
      console.log("Dữ liệu thêm:", dataConten);

      const notifications = fcmToken.map((itemtoken) => {
        const message = {
          to: itemtoken,
          sound: "default",
          title: title,
          body: body,
          data: dataConten,
        };

        console.log("Đang gửi thông báo với token:", itemtoken);
        // Gửi thông báo qua API của Expo
        return fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });
      });

      // Chạy tất cả các thông báo đồng thời
      await Promise.all(notifications);
      console.log("Hoàn thành gửi tất cả thông báo");
    } else {
      console.log("Không có token hợp lệ để gửi thông báo.");
    }
  } catch (error) {
    console.error("Lỗi khi gửi thông báo:", error);
  }
};
export default handlerFunction;
