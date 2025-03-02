// じゃんけんの手を定義
type Hand = 'rock' | 'paper' | 'scissors'

// じゃんけんの結果を定義
type Result = 'win' | 'lose' | 'draw'

// じゃんけんアプリケーションクラス
class JankenGame {
  private playerHand: HTMLElement | null
  private computerHand: HTMLElement | null
  private resultElement: HTMLElement | null
  private winsElement: HTMLElement | null
  private drawsElement: HTMLElement | null
  private lossesElement: HTMLElement | null
  private choiceButtons: NodeListOf<HTMLButtonElement>
  private resetButton: HTMLElement | null

  private wins: number = 0
  private draws: number = 0
  private losses: number = 0

  // 手と絵文字のマッピング
  private handEmojis: Record<Hand, string> = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️',
  }

  // 手と日本語名のマッピング
  private handNames: Record<Hand, string> = {
    rock: 'グー',
    paper: 'パー',
    scissors: 'チョキ',
  }

  constructor() {
    this.playerHand = document.getElementById('player-hand')
    this.computerHand = document.getElementById('computer-hand')
    this.resultElement = document.getElementById('result')
    this.winsElement = document.getElementById('wins')
    this.drawsElement = document.getElementById('draws')
    this.lossesElement = document.getElementById('losses')
    this.choiceButtons = document.querySelectorAll('.choice-btn')
    this.resetButton = document.getElementById('reset')

    this.initEventListeners()
  }

  // イベントリスナーの初期化
  private initEventListeners(): void {
    this.choiceButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const playerChoice = button.id as Hand
        this.play(playerChoice)
      })
    })

    if (this.resetButton) {
      this.resetButton.addEventListener('click', () => this.resetGame())
    }
  }

  // じゃんけん実行
  private play(playerChoice: Hand): void {
    // コンピューターの手をランダムに決定
    const computerChoice = this.getRandomHand()

    // 勝敗判定
    const result = this.determineWinner(playerChoice, computerChoice)

    // 結果の表示
    this.displayResult(playerChoice, computerChoice, result)

    // 成績の更新
    this.updateScore(result)
  }

  // ランダムな手の生成
  private getRandomHand(): Hand {
    const hands: Hand[] = ['rock', 'paper', 'scissors']
    const randomIndex = Math.floor(Math.random() * hands.length)
    return hands[randomIndex]
  }

  // 勝者の決定
  private determineWinner(playerChoice: Hand, computerChoice: Hand): Result {
    if (playerChoice === computerChoice) {
      return 'draw'
    }

    if (
      (playerChoice === 'rock' && computerChoice === 'scissors') ||
      (playerChoice === 'paper' && computerChoice === 'rock') ||
      (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
      return 'win'
    }

    return 'lose'
  }

  // 結果の表示
  private displayResult(playerChoice: Hand, computerChoice: Hand, result: Result): void {
    if (this.playerHand) {
      this.playerHand.textContent = this.handEmojis[playerChoice]
    }

    if (this.computerHand) {
      this.computerHand.textContent = this.handEmojis[computerChoice]
    }

    if (this.resultElement) {
      let resultText: string
      let resultClass: string

      switch (result) {
        case 'win':
          resultText = '勝ち！'
          resultClass = 'text-green-600'
          break
        case 'lose':
          resultText = '負け！'
          resultClass = 'text-red-600'
          break
        case 'draw':
          resultText = 'あいこ'
          resultClass = 'text-gray-600'
          break
      }

      this.resultElement.textContent = resultText
      this.resultElement.className = `text-2xl font-bold ${resultClass} min-h-[40px]`
    }
  }

  // スコアの更新
  private updateScore(result: Result): void {
    switch (result) {
      case 'win':
        this.wins++
        if (this.winsElement) {
          this.winsElement.textContent = this.wins.toString()
        }
        break
      case 'lose':
        this.losses++
        if (this.lossesElement) {
          this.lossesElement.textContent = this.losses.toString()
        }
        break
      case 'draw':
        this.draws++
        if (this.drawsElement) {
          this.drawsElement.textContent = this.draws.toString()
        }
        break
    }
  }

  // ゲームのリセット
  private resetGame(): void {
    this.wins = 0
    this.draws = 0
    this.losses = 0

    if (this.winsElement) this.winsElement.textContent = '0'
    if (this.drawsElement) this.drawsElement.textContent = '0'
    if (this.lossesElement) this.lossesElement.textContent = '0'

    if (this.playerHand) this.playerHand.textContent = '❓'
    if (this.computerHand) this.computerHand.textContent = '❓'
    if (this.resultElement) {
      this.resultElement.textContent = ''
      this.resultElement.className = 'text-2xl font-bold text-gray-800 min-h-[40px]'
    }
  }
}

// DOMが読み込まれたらゲームを開始
document.addEventListener('DOMContentLoaded', () => {
  new JankenGame()
})
