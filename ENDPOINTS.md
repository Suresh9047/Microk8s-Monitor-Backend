# Pod API Endpoints - Quick Reference

## 🚀 All Endpoints Ready!

All 4 pod endpoints are **fully implemented** according to your complete API requirements specification.

---

## Base URL

```
http://localhost:3000/api/k8s
```

**Authentication:** Bearer Token (required for all endpoints)

```http
Authorization: Bearer {your-jwt-token}
```

---

## 📡 Available Endpoints

### 1. List Pods

```http
GET /api/k8s/pods?namespace=default&phase=Running&label.app=nginx
```

**Returns:** JSON array of pods with basic info + metrics

**Key Fields:** id, name, namespace, status, phase, age, cpu, memory, restarts, nodeName

---

### 2. Get Pod Details

```http
GET /api/k8s/pods/{namespace}/{name}
```

**Returns:** JSON object with complete pod information

**Includes:**

- Basic info (id, name, namespace, status, phase, age, cpu, memory, restarts)
- Metadata (uid, createdAt, labels, annotations)
- Status (qosClass, podIP, hostIP, conditions)
- Containers (with image, state, ready, ports, resources)
- Events (sorted newest first, max 20)
- Owner references (if any)

---

### 3. Get Pod Logs

```http
GET /api/k8s/pods/{namespace}/{name}/logs?container=nginx&tailLines=100&timestamps=true
```

**Returns:** Plain text logs (Content-Type: text/plain)

**Query Params:**

- `container` - Container name (required for multi-container pods)
- `tailLines` - Number of lines (default: 100)
- `timestamps` - Include timestamps (default: false)
- `sinceSeconds` - Get logs from last N seconds

---

### 4. Delete Pod

```http
DELETE /api/k8s/pods/{namespace}/{name}
```

**Returns:** JSON object with success status

```json
{
  "success": true,
  "message": "Pod deleted successfully"
}
```

---

## 📊 Features Implemented

✅ All required fields from spec  
✅ Label filtering (`label.app=nginx&label.version=v1`)  
✅ Metrics from Kubernetes Metrics Server  
✅ Human-readable age calculation  
✅ Event sorting (newest first)  
✅ Multi-container pod support  
✅ Proper error handling  
✅ Swagger documentation

---

## 🔧 Testing

### Using cURL

**1. Login first:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'

# Save the token from response
```

**2. List pods:**

```bash
curl -X GET "http://localhost:3000/api/k8s/pods?namespace=default" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**3. Get pod details:**

```bash
curl -X GET "http://localhost:3000/api/k8s/pods/default/pod-name" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**4. Get logs:**

```bash
curl -X GET "http://localhost:3000/api/k8s/pods/default/pod-name/logs?tailLines=100" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**5. Delete pod:**

```bash
curl -X DELETE "http://localhost:3000/api/k8s/pods/default/pod-name" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 Documentation

- **Swagger UI:** http://localhost:3000/api-docs
- **Detailed API Docs:** See `POD_API_ENDPOINTS.md`
- **Complete Spec:** See `complete-api-requirements.md.resolved`

---

## ⚙️ Setup Requirements

### 1. MicroK8s Running

```bash
microk8s status
```

### 2. Enable Metrics Server (Optional but Recommended)

```bash
microk8s enable metrics-server
```

Without metrics server, CPU and memory will show "0m" and "0Mi" (everything else works fine).

### 3. Start Backend

```bash
npm run dev
```

Server runs on: http://localhost:3000

---

## ✅ Ready for Frontend Integration!

Your frontend can now connect to these endpoints. All response formats match your specification exactly.

**Need help?** Check the detailed documentation in `POD_API_ENDPOINTS.md`
