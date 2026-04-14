#!/usr/bin/env bash
# OpenAPI 3.x 基线 vs 最新规范：规范化 JSON 全文 diff + operation 清单增删（需 jq）。
# 所属: api-gen Skill（.cursor/skills/api-gen/scripts/），供 Agent 对比契约时使用。
# 用法: bash .cursor/skills/api-gen/scripts/openapi-diff.sh <baseline.json> <latest.json>
# 退出码: 0 完全一致, 1 存在差异, >1 参数/依赖错误

set -euo pipefail

usage() {
  echo "用法: $0 <baseline.json> <latest.json>" >&2
  echo "依赖: jq（brew install jq）" >&2
  exit 2
}

[[ $# -eq 2 ]] || usage

BASELINE=$1
LATEST=$2

if [[ ! -f "$BASELINE" ]] || [[ ! -f "$LATEST" ]]; then
  echo "错误: 文件不存在" >&2
  exit 2
fi

command -v jq >/dev/null 2>&1 || {
  echo "错误: 未找到 jq，请先安装（例如: brew install jq）" >&2
  exit 2
}

if ! jq empty "$BASELINE" 2>/dev/null; then
  echo "错误: baseline 不是合法 JSON: $BASELINE" >&2
  exit 2
fi
if ! jq empty "$LATEST" 2>/dev/null; then
  echo "错误: latest 不是合法 JSON: $LATEST" >&2
  exit 2
fi

# 列出所有 HTTP operation，一行一条: METHOD<TAB>PATH，排序后可用于 comm
list_operations() {
  jq -r '
    def http_methods: ["get","put","post","delete","options","head","patch","trace"];
    (.paths // {}) | to_entries[] | .key as $path
    | .value | to_entries[]
    | select(.key as $m | http_methods | index($m))
    | "\(.key | ascii_upcase)\t\($path)"
  ' "$1" | sort -u
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1) 规范化全文 diff（jq -S 排序键，避免键顺序造成的伪差异）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
set +e
diff -u <(jq -S . "$BASELINE") <(jq -S . "$LATEST")
CANONICAL_EXIT=$?
set -e
if [[ "$CANONICAL_EXIT" -eq 0 ]]; then
  echo "(规范化 JSON 无差异)"
elif [[ "$CANONICAL_EXIT" -eq 1 ]]; then
  :
else
  echo "diff 异常退出码: $CANONICAL_EXIT" >&2
  exit "$CANONICAL_EXIT"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2) Operation 清单（paths 下 HTTP 方法；仅增删一目了然）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

TMPDIR_LIST=$(mktemp -d)
trap 'rm -rf "$TMPDIR_LIST"' EXIT

list_operations "$BASELINE" >"$TMPDIR_LIST/baseline.ops"
list_operations "$LATEST" >"$TMPDIR_LIST/latest.ops"

ONLY_BASE=$(comm -23 "$TMPDIR_LIST/baseline.ops" "$TMPDIR_LIST/latest.ops" || true)
ONLY_LATEST=$(comm -13 "$TMPDIR_LIST/baseline.ops" "$TMPDIR_LIST/latest.ops" || true)

if [[ -z "${ONLY_BASE:-}" ]] && [[ -z "${ONLY_LATEST:-}" ]]; then
  echo "(operation 集合一致；若有契约变更，见上方全文 diff 中对应 path/method 片段)"
else
  if [[ -n "${ONLY_BASE:-}" ]]; then
    echo "--- 仅在 baseline（视为删除或迁出）---"
    printf '%s\n' "$ONLY_BASE"
    echo ""
  fi
  if [[ -n "${ONLY_LATEST:-}" ]]; then
    echo "--- 仅在 latest（视为新增）---"
    printf '%s\n' "$ONLY_LATEST"
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3) components.schemas 键集合（结构变更请仍以全文 diff 为准）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
jq -r '(.components.schemas // {}) | keys[]' "$BASELINE" 2>/dev/null | sort -u >"$TMPDIR_LIST/baseline.schemas" || true
jq -r '(.components.schemas // {}) | keys[]' "$LATEST" 2>/dev/null | sort -u >"$TMPDIR_LIST/latest.schemas" || true
if diff -q "$TMPDIR_LIST/baseline.schemas" "$TMPDIR_LIST/latest.schemas" >/dev/null 2>&1; then
  echo "(schema 名称集合一致)"
else
  echo "--- 仅在 baseline ---"
  comm -23 "$TMPDIR_LIST/baseline.schemas" "$TMPDIR_LIST/latest.schemas" || true
  echo "--- 仅在 latest ---"
  comm -13 "$TMPDIR_LIST/baseline.schemas" "$TMPDIR_LIST/latest.schemas" || true
fi

echo ""
echo "说明: 契约「改内容不改路径」时 operation 行不变，必须以第 1 节全文 diff 为准。"
exit "$CANONICAL_EXIT"
