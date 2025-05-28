import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// サンプルコンポーネント
function SampleComponent({ title }: { title: string }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>これはサンプルのテストです</p>
    </div>
  )
}

describe('SampleComponent', () => {
  test('正しくタイトルが表示される', () => {
    render(<SampleComponent title="テストタイトル" />)
    
    const titleElement = screen.getByText('テストタイトル')
    expect(titleElement).toBeInTheDocument()
  })

  test('説明文が表示される', () => {
    render(<SampleComponent title="テストタイトル" />)
    
    const description = screen.getByText('これはサンプルのテストです')
    expect(description).toBeInTheDocument()
  })

  test('h1タグが使用されている', () => {
    render(<SampleComponent title="テストタイトル" />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('テストタイトル')
  })
}) 