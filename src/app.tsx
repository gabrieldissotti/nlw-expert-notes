import { ChangeEvent, useEffect, useState } from 'react'
import logo from './assets/nlw-expert-logo.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

interface Note {
  id: string
  date: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')

    return notesOnStorage ? JSON.parse(notesOnStorage) : []
  })

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }

    const updatedNotes = [newNote, ...notes]

    setNotes(updatedNotes)

    localStorage.setItem('notes', JSON.stringify(updatedNotes))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query)
  }

  function onNoteDeleted(id: string) {
    const updatedNotes = notes.filter(note => note.id !== id)
    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
  }

  useEffect(() => {
    setNotes(search === '' ? notes : notes.filter(note => note.content.toLowerCase().includes(search.toLowerCase())))
  }, [search])

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="NLW Expert" />
      <form className="w-full mt-6">
        <input
          type="text"
          placeholder="busque em suas notas"
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />

        {
          notes.map(note => (
            <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
          ))
        }
      </div>
    </div>
  )
}
