# Worth It

## 開発環境のセットアップ

### 依存関係のインストール
```bash
pnpm install
```

### 開発サーバーの起動
```bash
pnpm dev
```

## テスト

このプロジェクトではJestとReact Testing Libraryを使用してテストを行います。

### テストの実行
```bash
# 全てのテストを実行
pnpm test

# ウォッチモードでテストを実行（ファイル変更時に自動実行）
pnpm test:watch

# カバレッジレポート付きでテストを実行
pnpm test:coverage
```

### テストファイルの作成
- テストファイルは `__tests__` ディレクトリ内、または `*.test.tsx` / `*.spec.tsx` という名前で作成してください
- コンポーネントのテストは `src/components/__tests__` に配置することを推奨します

### テストの例
基本的なコンポーネントテスト：
```tsx
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

test('コンポーネントが正しく表示される', () => {
  render(<YourComponent />)
  expect(screen.getByText('期待するテキスト')).toBeInTheDocument()
})
```

ユーザーイベントを含むテスト：
```tsx
import userEvent from '@testing-library/user-event'

test('ボタンクリックで状態が変わる', async () => {
  const user = userEvent.setup()
  render(<YourComponent />)
  
  await user.click(screen.getByRole('button'))
  expect(screen.getByText('変更後のテキスト')).toBeInTheDocument()
})
```

## その他のコマンド

```bash
# Linting
pnpm lint

# フォーマット
pnpm format

# プロダクションビルド
pnpm build
```