import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from '../../../src/components/header/Header'
import '@testing-library/jest-dom'
import type { PropsWithChildren } from 'react'

// lucide-reactのアイコンを全てモック
jest.mock('lucide-react', () => ({
  __esModule: true,
  Menu: (props: Record<string, unknown>) => <svg data-testid="mock-menu-icon" {...props} />,
  X: (props: Record<string, unknown>) => <svg data-testid="mock-x-icon" {...props} />,
}))

// useSessionをモック関数として定義
const mockUseSession = jest.fn()
jest.mock('next-auth/react', () => ({
  useSession: () => mockUseSession(),
  signOut: jest.fn(),
}))

jest.mock('next/link', () => {
  return ({ children, href, ...props }: PropsWithChildren<{ href: string } & Record<string, unknown>>) => <a href={href} {...props}>{children}</a>
})

describe('Header', () => {
  beforeEach(() => {
    // デフォルトは未認証
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' })
  })

  test('ロゴ（WorthIt）が表示される', () => {
    render(<Header />)
    expect(screen.getByText('WorthIt')).toBeInTheDocument()
  })

  test('メニューアイコンをクリックするとメニューが開き、ホームとログインが表示される', async () => {
    const user = userEvent.setup()
    render(<Header />)
    await user.click(screen.getByLabelText('メニューを開く'))
    const body = within(document.body)
    expect(body.getByText('ホーム')).toBeInTheDocument()
    expect(body.getByText('ログイン')).toBeInTheDocument()
  })

  test('認証済みの場合、投稿一覧・新規投稿・投稿管理・ログアウトが表示される', async () => {
    // 認証済みの状態に切り替え
    mockUseSession.mockReturnValue({
      data: { user: { name: 'test' } },
      status: 'authenticated',
    })
    const user = userEvent.setup()
    render(<Header />)
    await user.click(screen.getByLabelText('メニューを開く'))
    const body = within(document.body)
    expect(body.getByText('投稿一覧')).toBeInTheDocument()
    expect(body.getByText('新規投稿')).toBeInTheDocument()
    expect(body.getByText('投稿管理')).toBeInTheDocument()
    expect(body.getByText('ログアウト')).toBeInTheDocument()
  })
}) 