#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"

if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]] ; then
  # ビルドを続行
  echo "✅ - ビルドを続行します"
  exit 1;
else
  # ビルドをキャンセル
  echo "🛑 - ビルドをキャンセルしました"
  exit 0;
fi
