export default function primitiveSample() {
  const name = 'World'
  console.log(`Hello ${name}!`)

  const num = 123
  console.log(`num: ${num}`)

  const bool = true
  console.log(`bool: ${bool}`)

  const isOver18: boolean = num <= 100
  console.log(`isOver18: ${isOver18}`)
}
