// おみくじの結果の型を定義
type FortuneResult = '大吉' | '中吉' | '小吉' | '吉' | '凶' | '大凶'

// おみくじクラス
class OmikujiApp {
  private resultElement: HTMLElement | null
  private drawButton: HTMLElement | null

  constructor() {
    this.resultElement = document.getElementById('result')
    this.drawButton = document.getElementById('drawButton')
    this.init()
  }

  // 初期化処理
  private init(): void {
    if (this.drawButton) {
      this.drawButton.addEventListener('click', () => this.drawFortune())
    }
  }

  // おみくじを引く処理
  private drawFortune(): void {
    if (!this.resultElement) return

    // 演出のためにいったん「おみくじを引いています...」と表示
    this.resultElement.textContent = 'おみくじを引いています...'
    this.resultElement.className = 'text-5xl font-bold my-8 h-20 flex items-center justify-center text-gray-600'

    // 少し待ってから結果を表示
    setTimeout(() => {
      const result = this.getRandomFortune()

      if (!this.resultElement) return
      this.resultElement.textContent = result

      // 結果によって色を変える
      this.setResultStyle(result)
    }, 1000)
  }

  // ランダムでおみくじ結果を取得
  private getRandomFortune(): FortuneResult {
    const fortunes: FortuneResult[] = ['大吉', '中吉', '小吉', '吉', '凶', '大凶']
    const randomIndex = Math.floor(Math.random() * fortunes.length)
    return fortunes[randomIndex]
  }

  // 結果に応じてスタイルを設定
  private setResultStyle(result: FortuneResult): void {
    if (!this.resultElement) return

    // 共通のクラス
    const baseClasses = 'text-5xl font-bold my-8 h-20 flex items-center justify-center'

    // 結果によって色とエフェクトを変える
    switch (result) {
      case '大吉':
        this.resultElement.className = `${baseClasses} text-red-600 animate-pulse`
        break
      case '中吉':
        this.resultElement.className = `${baseClasses} text-orange-500`
        break
      case '小吉':
        this.resultElement.className = `${baseClasses} text-yellow-500`
        break
      case '吉':
        this.resultElement.className = `${baseClasses} text-green-600`
        break
      case '凶':
        this.resultElement.className = `${baseClasses} text-blue-700`
        break
      case '大凶':
        this.resultElement.className = `${baseClasses} text-purple-800`
        break
    }
  }
}

// アプリケーションの開始
document.addEventListener('DOMContentLoaded', () => {
  new OmikujiApp()
})
