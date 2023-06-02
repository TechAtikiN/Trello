interface Board {
  columns: Map<TypedColumn, Column>;
}

type TypedColumn = 'todo' | 'inprogress' | 'done';

interface Column {
  id: TypedColumn;
  todos: Todo[];
}

interface Todo {
  $id: string;
  $created: string;
  title: string;
  status: TypedColumn;
  image?: Image;
}

interface Image {
  buckedId: string;
  fileId: string;
} 

