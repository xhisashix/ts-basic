// 計算機の操作タイプ
type OperationType = '+' | '-' | '*' | '/' | '%'

// 計算履歴のエントリ型
interface HistoryEntry {
  expression: string
  result: string
  timestamp: Date
}

class Calculator {
  // DOM要素
  private displayElement: HTMLElement | null
  private currentInputElement: HTMLElement | null
  private previousOperationElement: HTMLElement | null
  private historyLogElement: HTMLElement | null
  private clearHistoryButton: HTMLElement | null
  private numberButtons: NodeListOf<HTMLButtonElement>
  private operationButtons: NodeListOf<HTMLButtonElement>
  private functionButtons: NodeListOf<HTMLButtonElement>
  private equalsButton: HTMLButtonElement | null

  // 計算機の状態
  private currentInput = '0'
  private previousInput = ''
  private operation: OperationType | null = null
  private shouldResetDisplay = false
  private history: HistoryEntry[] = []

  constructor() {
    // DOM要素の取得
    this.displayElement = document.getElementById('display')
    this.currentInputElement = document.getElementById('current-input')
    this.previousOperationElement = document.getElementById('previous-operation')
    this.historyLogElement = document.getElementById('history-log')
    this.clearHistoryButton = document.getElementById('clear-history')
    this.numberButtons = document.querySelectorAll('.number-btn')
    this.operationButtons = document.querySelectorAll('.operation-btn')
    this.functionButtons = document.querySelectorAll('.function-btn')
    this.equalsButton = document.querySelector('.equals-btn')

    // イベントリスナーの設定
    this.setupEventListeners()

    // ローカルストレージから履歴を読み込む
    this.loadHistory()
  }

  // イベントリスナーの設定
  private setupEventListeners(): void {
    // 数字ボタンのイベント
    this.numberButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const number = button.getAttribute('data-number')
        if (number !== null) {
          this.appendNumber(number)
        }
      })
    })

    // 演算子ボタンのイベント
    this.operationButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const operation = button.getAttribute('data-operation')
        if (operation !== null && this.isValidOperation(operation)) {
          this.handleOperation(operation as OperationType)
        }
      })
    })

    // 機能ボタンのイベント
    this.functionButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-action')
        if (action === 'clear') {
          this.clear()
        } else if (action === 'backspace') {
          this.backspace()
        }
      })
    })

    // イコールボタンのイベント
    if (this.equalsButton) {
      this.equalsButton.addEventListener('click', () => {
        this.calculate()
      })
    }

    // 履歴クリアボタンのイベント
    if (this.clearHistoryButton) {
      this.clearHistoryButton.addEventListener('click', () => {
        this.clearHistory()
      })
    }

    // キーボード入力のイベント
    document.addEventListener('keydown', (event) => {
      this.handleKeyboardInput(event)
    })
  }

  // 数字の追加処理
  private appendNumber(number: string): void {
    // 画面のリセットが必要な場合
    if (this.shouldResetDisplay) {
      this.currentInput = ''
      this.shouldResetDisplay = false
    }

    // 小数点が複数入力されないようにする
    if (number === '.' && this.currentInput.includes('.')) {
      return
    }

    // 先頭が0の場合の処理
    if (this.currentInput === '0' && number !== '.') {
      this.currentInput = number
    } else {
      this.currentInput += number
    }

    this.updateDisplay()
  }

  // 演算子の処理
  private handleOperation(operation: OperationType): void {
    if (this.currentInput === '') return

    // 続けて計算する場合は先に計算を実行
    if (this.previousInput !== '') {
      this.calculate()
    }

    this.operation = operation
    this.previousInput = this.currentInput
    this.shouldResetDisplay = true

    this.updateDisplay()
  }

  // 計算の実行
  private calculate(): void {
    if (this.previousInput === '' || this.operation === null) return

    let result = 0
    const prev = parseFloat(this.previousInput)
    const current = parseFloat(this.currentInput)

    // 演算子に応じた計算
    switch (this.operation) {
      case '+':
        result = prev + current
        break
      case '-':
        result = prev - current
        break
      case '*':
        result = prev * current
        break
      case '/':
        if (current === 0) {
          this.showError('ゼロで割ることはできません')
          return
        }
        result = prev / current
        break
      case '%':
        result = prev % current
        break
      default:
        return
    }

    // 計算式と結果を履歴に追加
    const operationSymbol = this.getOperationSymbol(this.operation)
    const expression = `${this.previousInput} ${operationSymbol} ${this.currentInput}`
    const formattedResult = this.formatNumber(result)

    this.addToHistory({
      expression,
      result: formattedResult,
      timestamp: new Date(),
    })

    // 結果の表示
    this.currentInput = formattedResult
    this.operation = null
    this.previousInput = ''
    this.shouldResetDisplay = true

    this.updateDisplay()
  }

  // 履歴に追加
  private addToHistory(entry: HistoryEntry): void {
    this.history.push(entry)
    this.updateHistoryDisplay()
    this.saveHistory()
  }

  // 履歴表示の更新
  private updateHistoryDisplay(): void {
    if (!this.historyLogElement) return

    if (this.history.length === 0) {
      this.historyLogElement.innerHTML = `
        <div class="text-gray-500 text-center italic">
          履歴はまだありません
        </div>
      `
      return
    }

    // 履歴の表示（新しい計算を上に表示）
    this.historyLogElement.innerHTML = this.history
      .slice()
      .reverse()
      .map((entry, index) => {
        const time = this.formatTime(entry.timestamp)
        return `
          <div class="bg-white p-3 rounded shadow mb-2 hover:bg-blue-50 transition-colors">
            <div class="text-sm text-gray-500">${time}</div>
            <div class="font-mono">
              ${this.escapeHtml(entry.expression)} = <span class="font-bold text-blue-600">${this.escapeHtml(
          entry.result
        )}</span>
            </div>
          </div>
        `
      })
      .join('')
  }

  // 履歴をクリア
  private clearHistory(): void {
    this.history = []
    this.updateHistoryDisplay()
    this.saveHistory()
  }

  // 時間のフォーマット
  private formatTime(date: Date): string {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  // HTMLエスケープ処理
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }
    return text.replace(/[&<>"']/g, (m) => map[m])
  }

  // 履歴をローカルストレージに保存
  private saveHistory(): void {
    try {
      localStorage.setItem('calcHistory', JSON.stringify(this.history))
    } catch (e) {
      console.error('履歴の保存に失敗しました:', e)
    }
  }

  // 履歴をローカルストレージから読み込み
  private loadHistory(): void {
    try {
      const savedHistory = localStorage.getItem('calcHistory')
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory)
        // 日付文字列をDateオブジェクトに変換
        this.history = parsedHistory.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }))
        this.updateHistoryDisplay()
      }
    } catch (e) {
      console.error('履歴の読み込みに失敗しました:', e)
      this.history = []
    }
  }

  // クリア処理
  private clear(): void {
    this.currentInput = '0'
    this.previousInput = ''
    this.operation = null
    this.shouldResetDisplay = false
    this.updateDisplay()
  }

  // バックスペース処理
  private backspace(): void {
    if (this.currentInput.length === 1) {
      this.currentInput = '0'
    } else {
      this.currentInput = this.currentInput.slice(0, -1)
    }
    this.updateDisplay()
  }

  // 表示の更新
  private updateDisplay(): void {
    if (this.currentInputElement) {
      this.currentInputElement.textContent = this.currentInput
    }

    if (this.previousOperationElement) {
      if (this.previousInput !== '' && this.operation) {
        const operationSymbol = this.getOperationSymbol(this.operation)
        this.previousOperationElement.textContent = `${this.previousInput} ${operationSymbol}`
      } else {
        this.previousOperationElement.textContent = ''
      }
    }
  }

  // エラーの表示
  private showError(message: string): void {
    if (this.currentInputElement) {
      this.currentInputElement.textContent = message
    }
    this.shouldResetDisplay = true
  }

  // 演算子記号の取得
  private getOperationSymbol(operation: OperationType): string {
    switch (operation) {
      case '+':
        return '+'
      case '-':
        return '−'
      case '*':
        return '×'
      case '/':
        return '÷'
      case '%':
        return '%'
      default:
        return ''
    }
  }

  // 数値のフォーマット（桁制限など）
  private formatNumber(number: number): string {
    const maxDigits = 12 // 最大桁数
    const numStr = number.toString()

    if (numStr.length > maxDigits) {
      // 指数表記を使用するか小数点以下を切り捨て
      if (number > Math.pow(10, maxDigits) || number < Math.pow(10, -maxDigits)) {
        return number.toExponential(maxDigits - 5) // 指数部分のスペースを考慮
      } else {
        return number.toFixed(maxDigits - numStr.split('.')[0].length - 1)
      }
    }

    return numStr
  }

  // 有効な演算子かチェック
  private isValidOperation(operation: string): boolean {
    return ['+', '-', '*', '/', '%'].includes(operation)
  }

  // キーボード入力の処理
  private handleKeyboardInput(event: KeyboardEvent): void {
    // 数字とピリオド
    if (/^\d$/.test(event.key) || event.key === '.') {
      this.appendNumber(event.key)
      this.animateButton(`[data-number="${event.key}"]`)
      event.preventDefault()
    }

    // 演算子
    else if (['+', '-', '*', '/'].includes(event.key)) {
      if (this.isValidOperation(event.key)) {
        this.handleOperation(event.key as OperationType)
        this.animateButton(`[data-operation="${event.key}"]`)
      }
      event.preventDefault()
    }

    // パーセント
    else if (event.key === '%') {
      this.handleOperation('%')
      this.animateButton('[data-operation="%"]')
      event.preventDefault()
    }

    // イコール
    else if (event.key === 'Enter' || event.key === '=') {
      this.calculate()
      this.animateButton('[data-action="equals"]')
      event.preventDefault()
    }

    // クリア
    else if (event.key === 'Escape') {
      this.clear()
      this.animateButton('[data-action="clear"]')
      event.preventDefault()
    }

    // バックスペース
    else if (event.key === 'Backspace') {
      this.backspace()
      this.animateButton('[data-action="backspace"]')
      event.preventDefault()
    }
  }

  // ボタンのアニメーション（キーボード入力時）
  private animateButton(selector: string): void {
    const button = document.querySelector(selector) as HTMLElement
    if (button) {
      button.classList.add('bg-opacity-75')
      setTimeout(() => {
        button.classList.remove('bg-opacity-75')
      }, 100)
    }
  }
}

// DOMが読み込まれたら計算機を初期化
document.addEventListener('DOMContentLoaded', () => {
  new Calculator()
})
