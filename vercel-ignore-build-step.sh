#!/bin/bash

echo "VERCEL_GIT_COMMIT_REF: $VERCEL_GIT_COMMIT_REF"
echo "VERCEL_GIT_COMMIT_MESSAGE: $VERCEL_GIT_COMMIT_MESSAGE"

# 許可するブランチのリスト
ALLOWED_BRANCHES=("develop")

# mainブランチへのマージかどうかを確認
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]]; then
  # マージコミットメッセージから元のブランチ名を抽出
  MERGE_BRANCH=$(echo "$VERCEL_GIT_COMMIT_MESSAGE" | grep -oP "Merge branch '\K[^']+")
  
  # 許可されたブランチからのマージかどうかを確認
  if [[ " ${ALLOWED_BRANCHES[@]} " =~ " ${MERGE_BRANCH} " ]]; then
    echo "✅ - ビルドを続行します (${MERGE_BRANCH}からのマージ)"
    exit 1
  else
    echo "🛑 - ビルドをキャンセルしました (許可されていないブランチ: ${MERGE_BRANCH})"
    exit 0
  fi
else
  echo "🛑 - mainブランチではないためビルドをキャンセルしました"
  exit 0
fi