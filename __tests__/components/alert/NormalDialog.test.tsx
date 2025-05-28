import { render, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NormalDialog from '../../../src/components/alert/NormalDialog'
import type { NormalDialogProps } from '../../../src/components/alert/NormalDialog'
import '@testing-library/jest-dom'

const defaultProps: NormalDialogProps = {
  title: '確認',
  description: '本当に実行しますか？',
  cancelText: 'キャンセル',
  confirmText: 'OK',
  onAction: jest.fn(),
  isOpenDialog: true,
  setIsOpenDialog: jest.fn(),
}

describe('NormalDialog', () => {
  test('タイトル・説明・ボタンテキストが表示される', () => {
    render(<NormalDialog {...defaultProps} />)
    const body = within(document.body)
    expect(body.getByText('確認')).toBeInTheDocument()
    expect(body.getByText('本当に実行しますか？')).toBeInTheDocument()
    expect(body.getByText('キャンセル')).toBeInTheDocument()
    expect(body.getByText('OK')).toBeInTheDocument()
  })

  test('キャンセルボタンを押してもonActionは呼ばれない', async () => {
    const user = userEvent.setup()
    render(<NormalDialog {...defaultProps} />)
    const body = within(document.body)
    await user.click(body.getByText('キャンセル'))
    expect(defaultProps.onAction).not.toHaveBeenCalled()
  })

  test('OKボタンを押すとonActionとsetIsOpenDialogが呼ばれる', async () => {
    const user = userEvent.setup()
    const onAction = jest.fn()
    const setIsOpenDialog = jest.fn()
    render(
      <NormalDialog
        {...defaultProps}
        onAction={onAction}
        setIsOpenDialog={setIsOpenDialog}
      />
    )
    const body = within(document.body)
    await user.click(body.getByText('OK'))
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(setIsOpenDialog).toHaveBeenCalledWith(false)
  })

  test('isOpenDialog=falseのときはダイアログが表示されない', () => {
    render(<NormalDialog {...defaultProps} isOpenDialog={false} />)
    const body = within(document.body)
    expect(body.queryByText('確認')).not.toBeInTheDocument()
  })
}) 