export default function notExistSample() {
  const name = null
  console.log(`notExist ${name}!`)

  if (!name) {
    console.log(`名無しです。`)
  } else {
    console.log(`名前は ${name}!`)
  }

  const age = undefined
  console.log(`年齢は ${age}`)

  if (!age) {
    console.log(`年齢は不明です。`)
  } else {
    console.log(`年齢は ${age}`)
  }
}
