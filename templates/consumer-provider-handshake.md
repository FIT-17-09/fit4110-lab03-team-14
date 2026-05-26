# Consumer–Provider Handshake

## Thông tin chung

- Lab: FIT4110 Lab 03
- Ngày: 2026-05-26
- Provider team: AI Vision team (Team 14)
- Consumer team: Camera / Core Business / Analytics
- Provider service: ai-vision
- Consumer service: camera / core-business / iot-ingestion (mock dependency)

## Contract

- Contract file: contracts/ai-vision.openapi.yaml
- Mock base URL: http://localhost:4011
- Auth method: Bearer token header `Authorization: Bearer {{authToken}}`
- Endpoint được test: GET /health, POST /api/v1/vision/analyze, POST /readings (Consumer smoke to IoT Ingestion mock)

## Smoke test

### Request

```http
POST /api/v1/vision/analyze
Authorization: Bearer {{authToken}}
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

### Expected response

```json
{
  "status": "received",
  "message": "Ảnh đã được đưa vào hàng đợi xử lý ngầm."
}
```

## Kết quả

- [x] Consumer gọi mock thành công.
- [x] Consumer parse được field cần dùng.
- [x] Consumer hiểu lỗi 4xx/5xx provider trả về.
- [x] Có Newman report hoặc screenshot.

## Ghi chú thay đổi hợp đồng

| Nội dung | Trước | Sau | Người đồng ý |
|---|---|---|---|
| Cấu trúc Error | Inline JSON error schemas | Chuẩn hóa schema `ProblemDetails` | Team 14 |
| Auth | Bổ sung Security Scheme JWT | Bổ sung BearerAuth header bắt buộc | Team 14 |

## Xác nhận

- Provider representative: AI Vision (Team 14)
- Consumer representative: Camera / IoT Ingestion (Team 14)
