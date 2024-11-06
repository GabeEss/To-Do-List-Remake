import React, { useState, useRef } from "react";
import { ToDo } from "../types/todo";

interface ToDoBoardProps {
    maxNumber: number;
}

const ToDoBoardDisplay: React.FC<ToDoBoardProps> = ({ maxNumber }) => {
    const [notes, setNotes] = useState<ToDo[]>([]);
    const [dragging, setDragging] = useState<boolean>(false);
    const [currentNoteId, setCurrentNoteId] = useState<number | null>(null);
    const [topOfStackId, setTopOfStackId] = useState<number | null>(null);
    const [highestZIndex, setHighestZIndex] = useState<number>(1);
    const startPos = useRef<{ x: number, y: number}>({x: 50, y: 50});
    const dragOffset = useRef<{ x: number, y: number }>({x: 0, y: 0});

    const getRandomColor = () => {
        const hue = Math.floor(Math.random() * 360); // Random hue between 0 and 360
        const saturation = 70;
        const lightness = 50; // Fixed lightness to avoid very dark or very light colors
        
        // The secondary color indicates the draggable part of the note. 
        return {
            primary: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            secondary: `hsl(${hue}, ${saturation}%, ${lightness - 20}%)`
        };
    }

    const handleEdit = (id: number, value: string) => {
        const updatedNotes = notes.map(note => {
            if(id === note.id) {
                return {
                    ...note,
                    content: value
                }
            } else return note;
        })
        setNotes(updatedNotes);
    }

    const handleDelete = (event: React.MouseEvent<HTMLElement>, id: number) => {
        event.preventDefault();
        const updatedNotes = notes.filter(note => note.id != id);
        setNotes(updatedNotes);
        setCurrentNoteId(null);
    }

    const handleMouseDown = (id: number, event: React.MouseEvent<HTMLDivElement>) => {
        const note = notes.find(note => note.id === id);
        if(note) {
            dragOffset.current = {
                x: event.clientX - note.position.x,
                y: event.clientY - note.position.y
            }
            setCurrentNoteId(id);
            setDragging(true);
            setHighestZIndex(prevZIndex => prevZIndex + 1);

            if(id === topOfStackId) {
                const colors = getRandomColor();
                const newNote: ToDo = {
                    id: new Date().getTime(),
                    content: "",
                    position: {x: startPos.current.x, y: startPos.current.y},
                    priority: false,
                    zIndex: 1,
                    color: colors.primary,
                    colorSecondary: colors.secondary
                }
                setNotes([...notes, newNote]);
                setTopOfStackId(newNote.id)
            }
        }
    }

    const handleMouseMove = (event: MouseEvent) => {
        if(dragging && currentNoteId !== null) {
            const updatedNotes = notes.map(note => {
                if(note.id === currentNoteId) {
                    return {
                        ...note,
                        position: {
                            x: event.clientX - dragOffset.current.x,
                            y: event.clientY - dragOffset.current.y
                        },
                        zIndex: highestZIndex
                    }
                }
                return note;
            })
            setNotes(updatedNotes);
        }
    }

    const handleMouseUp = () => {
        setDragging(false);
        setCurrentNoteId(null);
    }

    React.useEffect(() => {
        if(dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    }, [dragging]);

    React.useEffect(() => {
        const colors = getRandomColor();
        const newNote: ToDo = {
            id: new Date().getTime(),
            content: "",
            position: {x: startPos.current.x, y: startPos.current.y},
            priority: false,
            zIndex: 1,
            color: colors.primary,
            colorSecondary: colors.secondary
        }
        setNotes([...notes, newNote]);
        setTopOfStackId(newNote.id)
    }, []);

    return(
        <div className="container mt-4">
            <div className="notes-container">
                {notes.map((note) => (
                    <div
                    key={note.id}
                    className={`note card ${dragging && currentNoteId === note.id ? 'dragging' : ""}`}
                    style={{
                        left: note.position.x,
                        top: note.position.y,
                        zIndex: note.zIndex,
                        backgroundColor: note.color,
                    }}
                    >
                        <button 
                            className="trash-can"
                            onClick={(e) => handleDelete(e, note.id)}
                            >
                                <i className="bi bi-trash trash-can-icon"></i>
                        </button>
                        <div
                            className="note-handle moveable"
                            onMouseDown={(e) => handleMouseDown(note.id, e)}
                            style={{
                                cursor: 'grab',
                                backgroundColor: note.colorSecondary
                            }}
                        />
                        <textarea
                            className="form-control note-text"
                            value={note.content}
                            onChange={(e) => handleEdit(note.id, e.target.value)}
                            placeholder="Type here..."
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}



export default ToDoBoardDisplay;