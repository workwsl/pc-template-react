#!/usr/bin/env bash
# OpenAPI 3.x：将 latest 以「仅更新/新增」方式合并进 baseline（不删除 baseline 中的 path、method、schema 名）。
# 同一 path 下同名 HTTP 方法、同一 schema 名：整段对象以 latest 为准（非 jq 深合并）。
# 所属: api-review-upsert Skill（.cursor/skills/api-review-upsert/scripts/）
# 用法: bash openapi-merge-upsert.sh <baseline.json> <latest.json> <out.json>
# 退出码: 0 成功, >0 参数/依赖/JSON 错误

set -euo pipefail

usage() {
  echo "用法: $0 <baseline.json> <latest.json> <out.json>" >&2
  echo "依赖: jq（brew install jq）" >&2
  exit 2
}

[[ $# -eq 3 ]] || usage

BASELINE=$1
LATEST=$2
OUT=$3

if [[ ! -f "$BASELINE" ]] || [[ ! -f "$LATEST" ]]; then
  echo "错误: baseline 或 latest 文件不存在" >&2
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

jq -n \
  --slurpfile b "$BASELINE" \
  --slurpfile l "$LATEST" \
  '
  $b[0] as $base | $l[0] as $lat |
  ($base.paths // {}) as $bp | ($lat.paths // {}) as $lp |
  (($bp | keys) + ($lp | keys) | unique) as $path_keys |
  (reduce $path_keys[] as $path ({}; .[$path] = (
    ($bp[$path] // {}) as $bm | ($lp[$path] // {}) as $lm |
    (($bm | keys) + ($lm | keys) | unique) as $mkeys |
    (reduce $mkeys[] as $m ({}; .[$m] = (if ($lm | has($m)) then $lm[$m] else $bm[$m] end)))
  ))) as $merged_paths |
  ($base.components // {}) as $bc | ($lat.components // {}) as $lc |
  (if ($lc | length) == 0 then $bc else
    reduce ($lc | keys_unsorted[]) as $ck ($bc;
      if $ck == "schemas" then
        .schemas = (
          ($bc.schemas // {}) as $bs | ($lc.schemas // {}) as $ss |
          (($bs | keys) + ($ss | keys) | unique) as $snames |
          (reduce $snames[] as $n ({}; .[$n] = (if ($ss | has($n)) then $ss[$n] else $bs[$n] end)))
        )
      else
        .[$ck] = $lc[$ck]
      end
    )
  end) as $merged_components |
  $base
  | .paths = $merged_paths
  | .components = $merged_components
  | .openapi = ($lat.openapi // .openapi)
  | .info = ((.info // {}) * ($lat.info // {}))
  | if ($lat | has("servers")) and ($lat.servers != null) then .servers = $lat.servers else . end
  | if ($lat | has("security")) and ($lat.security != null) then .security = $lat.security else . end
  ' >"$OUT"

echo "已写入: $OUT"
exit 0
