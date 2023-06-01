import { NextResponse } from 'next/server'
import openai from '../../../openai'

export async function POST(request: Request) {
  const { todos } = await request.json()
  
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    temperature: 0.8,
    max_tokens: 1024,
    stream: false,
    prompt: `Hi there, provide a summary of the following todos. Count how many todos are there in each category such as 
        To do, in progress and done, then tell the user to have a productive day along with more motivation! Here's the data: ${JSON.stringify(todos)}.`
    // messages: [
    //   {
    //     role: 'system',
    //     content: `When responding, welcome the user always as Hey, how are you doing? Limit the response to 200 characters`
    //   },
    //   {
    //     role: 'user',
    //     content: 
    //   }
    // ]
  })
  const { data } = response
  return NextResponse.json(data.choices[0].text)
}