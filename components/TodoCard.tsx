'use client'
import getUrl from "@/lib/getUrl";
import { useBoardStore } from "@/store/BoardStore";
import { XCircleIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from "react-beautiful-dnd";

interface Props {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

const TodoCard = ({ todo, index, id, innerRef, draggableProps, dragHandleProps }: Props) => {
  const deleteTodo = useBoardStore(state => state.deleteTodo)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!)
        if (url) {
          setImageUrl(url.toString())
        }
      }
      fetchImage()
    }
  }, [todo])

  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      className='bg-white rounded-md space-y-2 drop-shadow-md'
    >
      <div className='flex justify-between items-center p-5'>
        <p>{todo.title}</p>
        <button onClick={() => deleteTodo(index, todo, id)} className='text-red-500 hover:text-red-600'>
          <XCircleIcon className='ml-5 h-8 w-8' />
        </button>
      </div>

      {imageUrl && (
        <div>
          <Image
            src={imageUrl}
            alt='Task image'
            width={400}
            height={400}
            className='w-full object-contain rounded-b-md'
          />
        </div>
      )}
    </div>
  )
}

export default TodoCard
