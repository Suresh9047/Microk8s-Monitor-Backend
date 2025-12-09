# ✅ Pod API Implementation Complete

## 🎉 Status: READY FOR FRONTEND INTEGRATION

All 4 endpoints are **implemented** and **tested**, matching your exact specification.

---

## 📡 Implemented Endpoints

### Base URL

```
http://localhost:3000/api/k8s
```

All endpoints require **Bearer Token Authentication**:

```http
Authorization: Bearer {your-jwt-token}
```

---

## 1️⃣ GET `/api/k8s/pods` - List All Pods

✅ **Status:** Implemented with filters and metrics

### Query Parameters

| Parameter     | Type   | Description         | Example                             |
| ------------- | ------ | ------------------- | ----------------------------------- |
| `namespace`   | string | Filter by namespace | `?namespace=default`                |
| `phase`       | string | Filter by phase     | `?phase=Running`                    |
| `nodeName`    | string | Filter by node      | `?nodeName=node-1`                  |
| `label.{key}` | string | Filter by label     | `?label.app=nginx&label.version=v1` |

### Example Requests

```http
GET /api/k8s/pods
GET /api/k8s/pods?namespace=default&phase=Running
GET /api/k8s/pods?label.app=nginx&label.version=v1
GET /api/k8s/pods?namespace=kube-system&nodeName=node-1
```

### Response Format

```json
[
  {
    "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
    "name": "nginx-ingress-cntr-984",
    "namespace": "ingress",
    "status": "Active",
    "phase": "Running",
    "age": "4d",
    "cpu": "12m",
    "memory": "142Mi",
    "restarts": 0,
    "nodeName": "node-1"
  }
]
```

**Field Details:**

- `id`: Unique UID from Kubernetes
- `status`: Computed status ("Active", "Running", "Pending", "Failed", "Succeeded")
- `phase`: Raw Kubernetes phase
- `age`: Human-readable age (e.g., "4d", "3h", "15m")
- `cpu` & `memory`: From Metrics Server API (returns "0m"/"0Mi" if unavailable)

---

## 2️⃣ GET `/api/k8s/pods/:namespace/:name` - Get Pod Details

✅ **Status:** Implemented with events and metrics

### URL Parameters

| Parameter   | Required | Description   |
| ----------- | -------- | ------------- |
| `namespace` | Yes      | Pod namespace |
| `name`      | Yes      | Pod name      |

### Example Request

```http
GET /api/k8s/pods/ingress/nginx-ingress-cntr-984
```

### Response Format

```json
{
  "id": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "name": "nginx-ingress-cntr-984",
  "namespace": "ingress",
  "status": "Active",
  "phase": "Running",
  "age": "4d",
  "cpu": "12m",
  "memory": "142Mi",
  "restarts": 0,
  "nodeName": "node-1",
  "uid": "a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6",
  "labels": {
    "app": "nginx-ingress",
    "version": "v1.2.3"
  },
  "annotations": {
    "kubernetes.io/created-by": "deployment-controller"
  },
  "conditions": [
    {
      "type": "Ready",
      "status": "True",
      "lastProbeTime": null,
      "lastTransitionTime": "2024-12-02T14:30:15Z",
      "reason": "ContainersReady",
      "message": "All containers are ready"
    }
  ],
  "containers": [
    {
      "name": "nginx",
      "image": "nginx:1.21.3",
      "state": "running",
      "ready": true,
      "restartCount": 0,
      "ports": [
        {
          "name": "http",
          "containerPort": 80,
          "protocol": "TCP"
        }
      ],
      "resources": {
        "requests": {
          "cpu": "100m",
          "memory": "128Mi"
        },
        "limits": {
          "cpu": "200m",
          "memory": "256Mi"
        }
      }
    }
  ],
  "events": [
    {
      "type": "Normal",
      "reason": "Scheduled",
      "message": "Successfully assigned ingress/nginx-ingress-cntr-984 to node-1",
      "timestamp": "2024-12-02T14:30:10Z",
      "count": 1
    }
  ],
  "ownerReferences": [
    {
      "kind": "Deployment",
      "name": "nginx-ingress",
      "uid": "x1y2z3a4-b5c6-7d8e-9f0g-h1i2j3k4l5m6"
    }
  ],
  "qosClass": "Burstable",
  "podIP": "10.244.0.5",
  "hostIP": "192.168.1.10",
  "createdAt": "2024-12-02T14:30:00Z"
}
```

---

## 3️⃣ GET `/api/k8s/pods/:namespace/:name/logs` - Get Pod Logs

✅ **Status:** Implemented - returns plain text

### URL Parameters

| Parameter   | Required | Description   |
| ----------- | -------- | ------------- |
| `namespace` | Yes      | Pod namespace |
| `name`      | Yes      | Pod name      |

### Query Parameters

| Parameter      | Type    | Default | Description                                        |
| -------------- | ------- | ------- | -------------------------------------------------- |
| `container`    | string  | -       | Container name (required for multi-container pods) |
| `tailLines`    | integer | 100     | Number of lines to fetch                           |
| `timestamps`   | boolean | false   | Include timestamps                                 |
| `sinceSeconds` | integer | -       | Get logs from last N seconds                       |

### Example Requests

```http
GET /api/k8s/pods/default/payment-service-v32/logs?container=payment-service&tailLines=500
GET /api/k8s/pods/default/nginx-pod/logs?tailLines=100&timestamps=true
GET /api/k8s/pods/kube-system/coredns-abc/logs?sinceSeconds=3600
```

### Response Format

**Content-Type:** `text/plain`

```
2024-12-06T14:30:15.123Z [INFO] Starting payment service v3.2
2024-12-06T14:30:16.456Z [INFO] Connecting to database
2024-12-06T14:30:17.789Z [INFO] Database connection established
2024-12-06T14:30:18.012Z [INFO] Initializing Redis cache
2024-12-06T14:30:19.678Z [INFO] HTTP server listening on port 8080
```

---

## 4️⃣ DELETE `/api/k8s/pods/:namespace/:name` - Delete Pod

✅ **Status:** Implemented

### URL Parameters

| Parameter   | Required | Description   |
| ----------- | -------- | ------------- |
| `namespace` | Yes      | Pod namespace |
| `name`      | Yes      | Pod name      |

### Example Request

```http
DELETE /api/k8s/pods/default/nginx-pod-123
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Pod deleted successfully"
}
```

### Error Response (500)

```json
{
  "success": false,
  "message": "Failed to delete pod: permission denied"
}
```

---

## 🔐 Authentication Example

```javascript
const token = localStorage.getItem("authToken");

fetch("/api/k8s/pods?namespace=default&phase=Running", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## 📊 Metrics Support

The API automatically fetches metrics from the **Kubernetes Metrics Server** if available.

**If Metrics Server is installed:**

- `cpu` and `memory` fields will show real values (e.g., "12m", "142Mi")

**If Metrics Server is NOT installed:**

- `cpu` and `memory` will default to "0m" and "0Mi"
- All other functionality works normally

To install Metrics Server on MicroK8s:

```bash
microk8s enable metrics-server
```

---

## ❌ Error Responses

All endpoints return standard error format:

**400 - Bad Request**

```json
{
  "message": "Namespace and name are required"
}
```

**401 - Unauthorized**

```json
{
  "message": "Unauthorized"
}
```

**500 - Internal Server Error**

```json
{
  "message": "Error description",
  "detail": "Additional details"
}
```

---

## 📝 Testing with cURL

### 1. Login to get token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

### 2. List pods

```bash
curl -X GET "http://localhost:3000/api/k8s/pods?namespace=default" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Get pod details

```bash
curl -X GET "http://localhost:3000/api/k8s/pods/default/pod-name" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Get pod logs

```bash
curl -X GET "http://localhost:3000/api/k8s/pods/default/pod-name/logs?tailLines=100" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Delete pod

```bash
curl -X DELETE "http://localhost:3000/api/k8s/pods/default/pod-name" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Integration Checklist for Frontend

- ✅ Update API base URL to `/api/k8s/pods`
- ✅ Response format matches your spec exactly
- ✅ All 4 endpoints ready (List, Details, Logs, Delete)
- ✅ Metrics included (cpu, memory)
- ✅ Label filtering supported (`label.app=nginx`)
- ✅ Logs return plain text (not JSON)
- ✅ Authentication via Bearer token
- ✅ Swagger docs available at `/api-docs`

---

## 🚀 Server Status

**Running on:** `http://localhost:3000`

**Swagger UI:** `http://localhost:3000/api-docs`

**Health Check:** `http://localhost:3000/`

---

## 🎉 You're Ready to Go!

Your frontend should now connect seamlessly with these endpoints. All response formats match your specification exactly.

If you encounter any issues, check:

1. JWT token is valid and included in headers
2. MicroK8s is running and accessible
3. Metrics Server is enabled (optional, but recommended)
