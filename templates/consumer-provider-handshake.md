# Consumer–Provider Handshake

## Thông tin chung

- Lab: FIT4110 Lab 03
- Ngày: 2026-05-26
- Provider team: AI Vision team (Team 14 — B4)
- Consumer team: Camera Stream (B2) — nhóm gửi ảnh vào B4
- Provider service: ai-vision
- Consumer service: camera-stream (B2)

## Contract

- Contract file: contracts/ai-vision.openapi.yaml
- Mock base URL: http://localhost:4011
- Auth method: Không bắt buộc ở mock; service thực gắn Bearer token khi gọi ra ngoài (B5, B6)
- Endpoint được test: `GET /health`, `POST /api/v1/vision/analyze`

> **Ghi chú kiến trúc**: B4 sử dụng kiến trúc **Asynchronous Fire-and-Forget**. Sau khi nhận ảnh từ B2 (Camera Stream), service trả về `202 Accepted` ngay lập tức rồi chạy YOLOv8 ngầm, sau đó tự động bắn Webhook sang B5 (Analytics) và B6 (Core Business) khi có kết quả. Response `202` **không** chứa kết quả AI — đây là thay đổi có chủ đích so với mô tả gốc 6.4.4 của đề tài.

## Smoke test

### Request (B2 → B4)

```http
POST /api/v1/vision/analyze
Content-Type: application/json
```

```json
{
  "camera_id": "cam-gate-01-entry",
  "image_url": "https://ultralytics.com/images/bus.jpg",
  "timestamp": "2026-05-22T10:30:00Z",
  "correlationId": "corr-unique-string-12345"
}
```

### Expected response (B4 → B2)

```json
{
  "status": "received",
  "message": "Ảnh đã được đưa vào hàng đợi xử lý ngầm."
}
```

> Kết quả AI thực sự (`detected`, `object`, `confidence`, `risk_level`) được B4 gửi qua Webhook sang B5 và B6 sau khi xử lý ngầm xong.

## Consumer-side smoke test (trong bộ test Newman)

Bộ test `05_Consumer_side_Smoke` trong Postman Collection mô phỏng vai trò **B4 là consumer** gọi vào mock IoT Ingestion (B3) để kiểm tra B4 có thể parse response của provider khác. Đây là bài tập consumer-side testing theo yêu cầu Lab 03, **không phải luồng nghiệp vụ thực**.

## Kết quả

- [x] Consumer gọi mock thành công.
- [x] Consumer parse được field cần dùng.
- [x] Consumer hiểu lỗi 4xx/5xx provider trả về.
- [x] Có Newman report (reports/newman-report.html và reports/newman-report-mock.xml).

## Ghi chú thay đổi hợp đồng

| Nội dung | Trước (đề tài gốc) | Sau (triển khai thực tế) | Người đồng ý |
|---|---|---|---|
| Kiến trúc response | Synchronous: trả `detected`, `confidence`, `risk_level` trực tiếp | Async Fire-and-Forget: trả `202 status=received`, kết quả AI gửi qua Webhook | Team 14 |
| Cấu trúc Error | Inline JSON error schemas | Chuẩn hóa schema ProblemDetails (RFC 9457) | Team 14 |
| Field bổ sung | `camera_id`, `image_url`, `timestamp` | Thêm `correlationId` để truy vết log xuyên suốt hệ thống | Team 14 + đàm phán với B2 |

## Xác nhận

- Provider representative: AI Vision (Team 14 — B4)
- Consumer representative: Camera Stream (B2)
