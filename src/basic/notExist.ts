export default function notExistSample() {
  let name = null
  console.log(`notExist ${name}!`)

  if(!name) {
    console.log(`名無しです。`)
  }else {
    console.log(`名前は ${name}!`)
  }

  let age = undefined
  console.log(`年齢は ${age}`)

  if(!age) {
    console.log(`年齢は不明です。`)
  }else {
    console.log(`年齢は ${age}`)
  }
}