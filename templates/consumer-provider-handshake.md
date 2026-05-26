# Consumer–Provider Handshake

## Thông tin chung

- Lab: FIT4110 Lab 03
- Ngày: 2026-05-23
- Provider team: IoT Ingestion team
- Consumer team: Camera/AI Vision test client
- Provider service: iot-ingestion
- Consumer service: camera-core / ai-vision

## Contract

- Contract file: contracts/iot-ingestion.openapi.yaml
- Mock base URL: http://localhost:4010
- Auth method: Bearer token header `Authorization: Bearer {{authToken}}`
- Endpoint được test: POST /readings, GET /readings/latest, POST /detect (AI Vision smoke)

## Smoke test

### Request

```http
POST /readings
Authorization: Bearer lab-token
Content-Type: application/json
```

```json
{
  "device_id": "device-123",
  "metric": "temperature",
  "value": 22.5,
  "timestamp": "2026-05-23T10:00:00Z"
}
```

### Expected response

```json
{
  "reading_id": "<uuid>",
  "accepted": true,
  "device_id": "device-123",
  "metric": "temperature",
  "value": 22.5
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
| | | | |

## Xác nhận

- Provider representative: Team IoT
- Consumer representative: Team Camera/AI Vision
