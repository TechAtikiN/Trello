import formatTodosForAI from "./formatTodosForAI"

const fetchSuggestion = async (board: Board) => {
  const todos = formatTodosForAI(board)
  console.log('formatted todos:', todos)

  const res = await fetch('/api/generateSummary', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ todos })
  })
  
  const GPTdata = await res.json()
  console.log('GPTdata:', GPTdata)

  return GPTdata
}

export default fetchSuggestion