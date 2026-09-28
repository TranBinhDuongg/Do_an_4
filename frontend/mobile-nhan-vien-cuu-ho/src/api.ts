import { API_URL } from './config';

export async function checkHealth(): Promise<string> {
  if (!API_URL) throw new Error('Chưa cấu hình EXPO_PUBLIC_API_URL trong tệp .env.');
  if (!/^https?:\/\//i.test(API_URL)) throw new Error('Địa chỉ API phải bắt đầu bằng http:// hoặc https://.');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(`${API_URL}/health`, { signal: controller.signal });
    if (!response.ok) throw new Error(`Backend trả lỗi HTTP ${response.status}.`);
    const data: unknown = await response.json();
    if (!data || typeof data !== 'object' || !('status' in data) || data.status !== 'OK') {
      throw new Error('Phản hồi không đúng định dạng API kiểm tra kết nối.');
    }
    return 'Đã kết nối backend';
  } catch (error) {
    if (controller.signal.aborted) throw new Error('Hết thời gian chờ. Kiểm tra địa chỉ backend và mạng.');
    if (error instanceof TypeError) throw new Error('Không thể kết nối. Kiểm tra backend, IP máy tính và mạng Wi-Fi.');
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
