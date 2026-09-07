// [LỚP 1: PRESENTATION LAYER]
// Base Controller - Chuẩn hóa Response trả về cho Client
class BaseController {
  sendSuccess(res, data = null, message = 'Thao tác thành công', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data
    });
  }

  sendCreated(res, data, message = 'Khởi tạo thành công') {
    return this.sendSuccess(res, data, message, 201);
  }
}

module.exports = BaseController;
