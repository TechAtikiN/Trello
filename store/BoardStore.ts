import { databases, storage } from '@/appwrite'
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn'
import { ID } from 'appwrite'
import { create } from 'zustand'

import uploadImage from '@/lib/uploadImage'

interface BoardStore {
  board: Board,
  getBoard: () => void,
  setBoardState: (board: Board) => void,
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void,
  newTaskInput: string,
  newTaskType: TypedColumn,
  searchString: string,
  image: File | null,
  
  setSearchString: (searchString: string) => void,
  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void,
  deleteTodo: (taskIndex: number, todoId: Todo, id: TypedColumn) => void,
  setNewTaskInput: (input: string) => void,
  setNewTaskType: (columnId: TypedColumn) => void,
  setImage: (image: File | null) => void,
}

export const useBoardStore = create<BoardStore>((set, get) => ({
  searchString: '',
  newTaskType: 'todo',
  image: null,

  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  
  setSearchString: (searchString) => set({ searchString }),
  
  getBoard: async () => {
    const board = await getTodosGroupedByColumn()
    set({ board })
  },

  setBoardState: (board) => set({ board }),

  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId
      }
      )
    },

  deleteTodo: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns)

    newColumns.get(id)?.todos.splice(taskIndex, 1)

    set({ board: { columns: newColumns } })

    if (todo.image) {
      await storage.deleteFile(todo.image.buckedId, todo.image.fileId)
    }
    
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
      )
    },
    
  newTaskInput: '',
    
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
    
  setNewTaskType: (type: TypedColumn) => set({ newTaskType: type }),
  setImage: (image: File | null) => set({ image }),

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined

    if (image) {
      const fileUploaded = await uploadImage(image)
      if (fileUploaded) {
        file = {
          buckedId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        }
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        //inclue image if it exists
        ...(file && { image: JSON.stringify(file) })
      }
      )
      
    set({ newTaskInput: '' })
      
      set((state) => {
        const newColumns = new Map(state.board.columns)
        
        const newTodo: Todo = {
          $id,
          $created: new Date().toISOString(),
          title: todo,
          status: columnId,
          // include image if it exists
          ...(file && { image: file })
        }
        
        const column = newColumns.get(columnId)
        
        if (!column) {
          newColumns.set(columnId, {
            id: columnId,
          todos: [newTodo]
        })
      } else {
        newColumns.get(columnId)?.todos.push(newTodo)
      }

      return {
        board: {
          columns: newColumns
        }
      }
    })
  }
}))