import React, { useState } from "react";
import { ToDo } from "../types/todo";

interface ToDoBoardProps {
    maxNumber: number;
}

const ToDoBoardDisplay: React.FC<ToDoBoardProps> = ({ maxNumber }) => {
    const [notes, setNotes] = useState<ToDo[]>([]);
    const [inputValue, setInputValue] = useState<string>('');

    const addNote = () => {
        if(notes.length < maxNumber) {
            const newNote: ToDo = {
                id: Date.now(),
                content: '',
                position: { x: 0, y: 0},
                priority: false,
            };
            setNotes([...notes, newNote]);
            setInputValue('');
        } else console.log("Maximum number of notes.");
    }

    const deleteNote = (id: number) => {
        setNotes(notes.filter(note => note.id !== id));
    }
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        e.dataTransfer.setData("text/plain", id.toString());
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        const noteId = parseInt(e.dataTransfer.getData("text"));
        deleteNote(noteId);
    }

    const allowDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    return(
        <div className="todo-board">
            <div className="new-note-container">
                <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Only 50 characters per note. Only 16 notes."
                maxLength={50}
                />
                <button onClick={addNote} className="btn btn-primary">Add Note</button>
            </div>
            <div className="notes-container">
                {notes.map(note => (
                    <div 
                    key={note.id} 
                    className="note card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, note.id)}
                    >
                        <p>{note.content}</p>
                    </div>
                ))}
            </div>
            <div 
            className="trash-can card"
            onDrop={handleDrop}
            onDragOver={allowDrop}>
                <i className="bi bi-trash"></i>
            </div>
        </div>
    );
}



export default ToDoBoardDisplay;