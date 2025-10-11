# API 文档

## 基础信息

- **Base URL**: `http://localhost:3000`
- **内容类型**: `application/json`
- **认证方式**: Session Cookie

## 认证接口

### 1. Gmail 登录

**端点**: `GET /auth/google`

**描述**: 重定向到 Google OAuth 登录页面

**示例**:
```bash
curl http://localhost:3000/auth/google
```

---

### 2. OAuth 回调

**端点**: `GET /auth/google/callback`

**描述**: Google OAuth 回调地址（由 Google 自动调用）

---

### 3. 获取当前用户

**端点**: `GET /auth/user`

**描述**: 获取当前登录用户信息

**需要认证**: ✓

**响应示例**:
```json
{
  "email": "user@gmail.com",
  "subscriptionStatus": "active",
  "subscriptionExpiry": "2024-12-31T23:59:59.000Z",
  "points": 1000,
  "modelQuota": 3
}
```

---

### 4. 检查认证状态

**端点**: `GET /auth/check`

**描述**: 检查用户是否已登录

**响应示例**:
```json
{
  "authenticated": true
}
```

---

### 5. 登出

**端点**: `GET /auth/logout`

**描述**: 用户登出

---

## 订阅管理接口

### 1. 获取订阅套餐

**端点**: `GET /api/plans`

**描述**: 获取所有可用的订阅套餐

**响应示例**:
```json
{
  "plans": [
    {
      "id": "basic_monthly",
      "name": "Basic",
      "displayName": "Basic 月付",
      "billingCycle": "monthly",
      "price": 19,
      "points": 50,
      "modelQuota": 1,
      "features": [
        "50 积分（一次性）",
        "1 模型/月",
        "每次任务消耗 10 积分",
        "按月付费"
      ]
    }
  ]
}
```

---

### 2. 创建支付会话

**端点**: `POST /api/subscription/create-checkout`

**描述**: 创建 Stripe 支付会话

**需要认证**: ✓

**请求体**:
```json
{
  "planId": "pro_monthly"
}
```

**响应示例**:
```json
{
  "sessionId": "cs_test_xxxxx",
  "url": "https://checkout.stripe.com/xxxxx"
}
```

---

### 3. Stripe Webhook

**端点**: `POST /api/subscription/webhook`

**描述**: 接收 Stripe Webhook 事件（由 Stripe 自动调用）

**Content-Type**: `application/json` (raw)

**Header**: `stripe-signature`

---

### 4. 获取订阅状态

**端点**: `GET /api/subscription/status`

**描述**: 获取当前用户的订阅状态

**需要认证**: ✓

**响应示例**:
```json
{
  "hasSubscription": true,
  "subscription": {
    "id": 1,
    "email": "user@gmail.com",
    "plan_type": "Pro",
    "billing_cycle": "monthly",
    "price": 49,
    "points_awarded": 1000,
    "model_quota_awarded": 3,
    "start_date": "2024-01-01T00:00:00.000Z",
    "end_date": "2024-02-01T00:00:00.000Z",
    "status": "active",
    "stripe_subscription_id": "sub_xxxxx",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. 获取订阅历史

**端点**: `GET /api/subscription/history`

**描述**: 获取用户的所有订阅记录

**需要认证**: ✓

**响应示例**:
```json
{
  "subscriptions": [
    {
      "id": 1,
      "email": "user@gmail.com",
      "plan_type": "Pro",
      "billing_cycle": "monthly",
      "price": 49,
      "points_awarded": 1000,
      "model_quota_awarded": 3,
      "start_date": "2024-01-01T00:00:00.000Z",
      "end_date": "2024-02-01T00:00:00.000Z",
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 6. 取消订阅

**端点**: `POST /api/subscription/cancel`

**描述**: 取消当前订阅

**需要认证**: ✓

**响应示例**:
```json
{
  "message": "订阅已取消"
}
```

---

## 使用/消耗接口

### 1. 消耗积分和配额

**端点**: `POST /api/usage/consume`

**描述**: 消耗 10 积分和 1 模型配额

**需要认证**: ✓

**响应示例（成功）**:
```json
{
  "message": "消耗成功",
  "consumed": {
    "points": 10,
    "modelQuota": 1
  },
  "balance": {
    "points": 990,
    "modelQuota": 2
  }
}
```

**响应示例（失败）**:
```json
{
  "error": "积分不足，请充值",
  "currentPoints": 5,
  "required": 10
}
```

---

### 2. 查询余额

**端点**: `GET /api/usage/balance`

**描述**: 查询当前用户的积分和配额余额

**需要认证**: ✓

**响应示例**:
```json
{
  "email": "user@gmail.com",
  "points": 1000,
  "modelQuota": 3,
  "subscriptionStatus": "active",
  "subscriptionExpiry": "2024-12-31T23:59:59.000Z"
}
```

---

## 错误响应

所有接口在出错时返回以下格式：

```json
{
  "error": "错误描述"
}
```

### 常见错误码

- `401 Unauthorized`: 未登录或认证失败
- `400 Bad Request`: 请求参数错误
- `404 Not Found`: 资源不存在
- `500 Internal Server Error`: 服务器内部错误

---

## Webhook 事件

### Stripe Webhook 事件类型

1. **checkout.session.completed**
   - 支付成功
   - 首次订阅创建
   - 自动发放积分和模型配额

2. **invoice.paid**
   - 订阅续费成功
   - 只刷新模型配额，不发放积分

3. **customer.subscription.updated**
   - 订阅升级/降级
   - 积分累加，配额替换

4. **customer.subscription.deleted**
   - 订阅取消
   - 清空所有权益

---

## 使用示例

### JavaScript/Fetch

```javascript
// 获取用户信息
const getUserInfo = async () => {
  const response = await fetch('/auth/user', {
    credentials: 'include'
  });
  const user = await response.json();
  console.log(user);
};

// 创建订阅
const subscribe = async (planId) => {
  const response = await fetch('/api/subscription/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ planId }),
    credentials: 'include',
  });
  const data = await response.json();
  window.location.href = data.url;
};

// 消耗资源
const consume = async () => {
  const response = await fetch('/api/usage/consume', {
    method: 'POST',
    credentials: 'include',
  });
  const data = await response.json();
  console.log(data);
};
```

### cURL

```bash
# 获取用户信息
curl -X GET http://localhost:3000/auth/user \
  -H "Cookie: connect.sid=xxxxx"

# 创建订阅
curl -X POST http://localhost:3000/api/subscription/create-checkout \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=xxxxx" \
  -d '{"planId":"pro_monthly"}'

# 消耗资源
curl -X POST http://localhost:3000/api/usage/consume \
  -H "Cookie: connect.sid=xxxxx"
```

