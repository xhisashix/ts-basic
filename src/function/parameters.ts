// オプションパラメーターを持つ関数
export const isUserSingledIn = (userId: string, userName?: string): boolean => {
  if (userId === 'admin') {
    console.log('admin is singled in', userName)
    return true
  } else {
    console.log('user is not singled in', userName)
    return false
  }
}

// デフォルトパラメーターを持つ関数
export const isUserSingledIn2 = (userId: string, userName = 'guest'): boolean => {
  if (userId === 'admin') {
    console.log('admin is singled in', userName)
    return true
  } else {
    console.log('user is not singled in', userName)
    return false
  }
}

// レストパラメーターを持つ関数
export const sumProductsPrice = (...products: number[]): number => {
  return products.reduce((prevTotal, productPrice) => {
    return prevTotal + productPrice
  }, 0)
}
