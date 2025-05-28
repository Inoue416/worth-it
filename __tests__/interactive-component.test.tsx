import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { useState } from 'react'

// インタラクティブなサンプルコンポーネント
function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>カウント: {count}</p>
      <button 
        type="button"
        onClick={() => setCount(count + 1)}
        data-testid="increment-button"
      >
        増加
      </button>
      <button 
        type="button"
        onClick={() => setCount(count - 1)}
        data-testid="decrement-button"
      >
        減少
      </button>
      <button 
        type="button"
        onClick={() => setCount(0)}
        data-testid="reset-button"
      >
        リセット
      </button>
    </div>
  )
}

describe('Counter', () => {
  test('初期値が0で表示される', () => {
    render(<Counter />)
    
    expect(screen.getByText('カウント: 0')).toBeInTheDocument()
  })

  test('増加ボタンをクリックするとカウントが増える', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    
    const incrementButton = screen.getByTestId('increment-button')
    
    await user.click(incrementButton)
    expect(screen.getByText('カウント: 1')).toBeInTheDocument()
    
    await user.click(incrementButton)
    expect(screen.getByText('カウント: 2')).toBeInTheDocument()
  })

  test('減少ボタンをクリックするとカウントが減る', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    
    const incrementButton = screen.getByTestId('increment-button')
    const decrementButton = screen.getByTestId('decrement-button')
    
    // まず2回増加
    await user.click(incrementButton)
    await user.click(incrementButton)
    expect(screen.getByText('カウント: 2')).toBeInTheDocument()
    
    // 1回減少
    await user.click(decrementButton)
    expect(screen.getByText('カウント: 1')).toBeInTheDocument()
  })

  test('リセットボタンをクリックするとカウントが0になる', async () => {
    const user = userEvent.setup()
    render(<Counter />)
    
    const incrementButton = screen.getByTestId('increment-button')
    const resetButton = screen.getByTestId('reset-button')
    
    // まず増加
    await user.click(incrementButton)
    await user.click(incrementButton)
    await user.click(incrementButton)
    expect(screen.getByText('カウント: 3')).toBeInTheDocument()
    
    // リセット
    await user.click(resetButton)
    expect(screen.getByText('カウント: 0')).toBeInTheDocument()
  })
}) 