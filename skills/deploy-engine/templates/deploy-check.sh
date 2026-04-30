#!/bin/bash
set -e

URL="${1:-http://localhost:3000}"
TIMEOUT=30
PASSED=0
FAILED=0

echo "🔍 部署验证开始 - 目标: $URL"
echo "---"

check_http() {
    local url="$1"
    local expected="$2"
    local label="$3"
    local response
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$url")
    if [ "$response" = "$expected" ]; then
        echo "✅ $label: HTTP $response"
        PASSED=$((PASSED + 1))
    else
        echo "❌ $label: HTTP $response (期望 $expected)"
        FAILED=$((FAILED + 1))
    fi
}

check_http "$URL" "200" "首页访问"
check_http "$URL/api/health" "200" "API 健康检查" 2>/dev/null || echo "⚠️  API 健康检查: 端点不存在（跳过）"

RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" --max-time "$TIMEOUT" "$URL")
if (( $(echo "$RESPONSE_TIME < 3.0" | bc -l) )); then
    echo "✅ 首页加载时间: ${RESPONSE_TIME}s (< 3s)"
    PASSED=$((PASSED + 1))
else
    echo "❌ 首页加载时间: ${RESPONSE_TIME}s (>= 3s)"
    FAILED=$((FAILED + 1))
fi

echo "---"
echo "📊 验证结果: $PASSED 通过, $FAILED 失败"

if [ "$FAILED" -gt 0 ]; then
    echo "❌ 部署验证失败"
    exit 1
else
    echo "✅ 部署验证通过"
    exit 0
fi
