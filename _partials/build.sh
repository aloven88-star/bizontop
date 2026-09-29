#!/bin/bash
# Usage: build.sh <output> <base> <active_key> <title> <desc> <content_file>
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$1"; BASE="$2"; ACTIVE="$3"; TITLE="$4"; DESC="$5"; CONTENT="$6"

esc_sed() { printf '%s' "$1" | sed -e 's/[&/\]/\\&/g'; }

BASE_ESC=$(esc_sed "$BASE")
TITLE_ESC=$(esc_sed "$TITLE")
DESC_ESC=$(esc_sed "$DESC")

tmp=$(mktemp)
cat "$DIR/head-open.html" "$DIR/header.html" "$CONTENT" "$DIR/footer.html" > "$tmp"

sed -i \
  -e "s/__BASE__/${BASE_ESC}/g" \
  -e "s/__TITLE__/${TITLE_ESC}/g" \
  -e "s/__DESC__/${DESC_ESC}/g" \
  "$tmp"

# set matching nav key to "active", clear all others
for key in HOME PF SME VENTURE CERT BLOG FAQ ABOUT; do
  if [ "$key" = "$ACTIVE" ]; then
    sed -i "s/__ACTIVE_${key}__/active/g" "$tmp"
  else
    sed -i "s/__ACTIVE_${key}__//g" "$tmp"
  fi
done

mkdir -p "$(dirname "$OUT")"
mv "$tmp" "$OUT"
echo "Built: $OUT"
