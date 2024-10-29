import React, { useState, useRef } from "react";
import { ToDo } from "../types/todo";

interface ToDoBoardProps {
    maxNumber: number;
}

const ToDoBoardDisplay: React.FC<ToDoBoardProps> = ({ maxNumber }) => {
    const [notes, setNotes] = useState<ToDo[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    const [dragging, setDragging] = useState<boolean>(false);
    const [currentNoteId, setCurrentNoteId] = useState<number | null>(null);
    const [highestZIndex, setHighestZIndex] = useState<number>(1);
    const startPos = useRef<{ x: number, y: number}>({x: 50, y: 50});
    const dragOffset = useRef<{ x: number, y: number }>({x: 0, y: 0});

    const getRandomColor = () => {

        const hue = Math.floor(Math.random() * 360); // Random hue between 0 and 360
        const saturation = 70; // Fixed saturation to ensure vibrant colors
        const lightness = 50; // Fixed lightness to avoid very dark or very light colors
        return {
            primary: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
            secondary: `hsl(${hue}, ${saturation}%, ${lightness - 20}%)`
        };
    }

    const addNote = () => {
        if(notes.length < maxNumber && inputValue.trim()) {
            const colors = getRandomColor();
            const newNote: ToDo = {
                id: new Date().getTime(),
                content: inputValue,
                position: {x: startPos.current.x, y: startPos.current.y},
                priority: false,
                zIndex: 1,
                color: colors.primary,
                colorSecondary: colors.secondary
            }
            setNotes([...notes, newNote]);
            setInputValue('');
        }
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
    }, [dragging])

    return(
        <div className="container mt-4">
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a note"
                />
                <button className="btn btn-primary" onClick={addNote}>Add Note</button>
            </div>
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
                        <div
                            className="note-handle moveable"
                            onMouseDown={(e) => handleMouseDown(note.id, e)}
                            style={{
                                cursor: 'grab',
                                backgroundColor: note.colorSecondary
                            }}
                        />
                        <div className="card-body">
                        { currentNoteId === note.id ? <span>Hello</span> : <span>{note.content}</span> }
                        {/* <input
                            type="textarea"
                            className="form-control"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type here..."
                        /> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}



export default ToDoBoardDisplay;