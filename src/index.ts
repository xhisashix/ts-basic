import World from './world'

const root = document.getElementById('root')
const world = new World('Hello World!')

world.sayHello(root)

import { anySample, primitiveSample, notExistSample, unknownSample } from './basic'

primitiveSample()
notExistSample()
anySample()
unknownSample()

//関数の型定義
import { logMessage } from './function/basic'
import { isUserSingledIn, isUserSingledIn2, sumProductsPrice } from './function/parameters'

logMessage('Hello World!')

isUserSingledIn('admin', 'admin')
isUserSingledIn2('guest')

const num = sumProductsPrice(1, 2, 3, 4, 5)
console.log(num)
