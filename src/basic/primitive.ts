export default function primitiveSample () {
  let name: String = 'World'
  console.log(`Hello ${name}!`)

  let num: Number = 123
  console.log(`num: ${num}`)

  let bool: Boolean = true
  console.log(`bool: ${bool}`)

  const isOver18: Boolean = num <= 100
  console.log(`isOver18: ${isOver18}`)
}