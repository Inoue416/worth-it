import { renderHook, act } from '@testing-library/react'
import { useMyPostGetById } from '../../src/hooks/useMyPostGetById'

// 必要なモック（jest.mockより前に定義）
const mockPush = jest.fn()
// mockFetchImageはここで定義しない

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))
jest.mock('sonner', () => ({
  toast: { error: jest.fn() },
}))
jest.mock('../../src/lib/firebase/firebaseProvider', () => ({
  app: {},
}))
jest.mock('../../src/lib/firebase/firebaseStorage', () => ({
  fetchImage: jest.fn(),
}))

describe('useMyPostGetById', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    jest.clearAllMocks()
    getMockFetchImage().mockReset()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  function getMockToastError() {
    return require('sonner').toast.error
  }
  function getMockFetchImage() {
    return require('../../src/lib/firebase/firebaseStorage').fetchImage
  }

  test('正常にデータ取得できた場合、postとisLoadingが正しく更新される', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        posts: {
          id: 1,
          title: 'タイトル',
          appealPoint: 'アピール',
          price: 1000,
          link: 'https://example.com',
          category: 'カテゴリ',
          updatedAt: '2024-01-01',
          imageUrl: 'image-url',
        },
      }),
    }) as unknown as typeof fetch

    getMockFetchImage().mockResolvedValue('mocked-image-src')

    const { result } = renderHook(() => useMyPostGetById())

    await act(async () => {
      await result.current.fetchMyPost(1)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.post).toEqual({
      id: 1,
      title: 'タイトル',
      appealPoint: 'アピール',
      price: 1000,
      link: 'https://example.com',
      category: 'カテゴリ',
      updatedAt: '2024-01-01',
      imageUrl: 'image-url',
      imageSrc: 'mocked-image-src',
    })
    expect(getMockFetchImage()).toHaveBeenCalledWith({}, 'image-url')
    expect(getMockToastError()).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  test('fetchが失敗した場合、エラートーストとリダイレクトが呼ばれる', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    }) as unknown as typeof fetch

    const { result } = renderHook(() => useMyPostGetById())

    await act(async () => {
      await result.current.fetchMyPost(1)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.post).toBeUndefined()
    expect(getMockToastError()).toHaveBeenCalledWith('不正なアクセスです')
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  test('例外が発生した場合、エラートーストとリダイレクトが呼ばれる', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('fetch error')) as unknown as typeof fetch

    const { result } = renderHook(() => useMyPostGetById())

    await act(async () => {
      await result.current.fetchMyPost(1)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.post).toBeUndefined()
    expect(getMockToastError()).toHaveBeenCalledWith('不正なアクセスです')
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})
