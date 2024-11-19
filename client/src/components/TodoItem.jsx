import React, { useState } from "react";
import axios from "axios";

const TodoItem = ({ todo, dispatch }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState(todo.description);

  const handleComplete = async () => {
    const token = localStorage.getItem("authToken"); // Get the token from localStorage
    if (!token) {
      console.error("No token found, please log in.");
      return; // Prevent the request from being sent if there's no token
    }
  
    try {
      const response = await axios.put(
        `http://localhost:5000/todos/${todo.todo_id}`,  // Endpoint to update a todo (mark as complete)
        { completed: !todo.completed },  // Data to send (toggle completed status)
        {
          headers: {
            "Authorization": `Bearer ${token}`,  // Attach token here
          },
        }
      );
  
      dispatch({ type: "TOGGLE_TODO_COMPLETED", payload: response.data });  // Update state after successful completion
    } catch (err) {
      console.error("Error updating todo:", err);  // Log error if something goes wrong
    }
  };
  


    // Define handleDelete function to remove the todo
    const handleDelete = async () => {
      const token = localStorage.getItem("authToken"); // Get the token from localStorage
      if (!token) {
        console.error("No token found, please log in.");
        return; // Prevent the request from being sent if there's no token
      }
    
      try {
        // Send DELETE request to the backend to delete the todo
        await axios.delete(`http://localhost:5000/todos/${todo.todo_id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,  // Attach token here
          },
        });
    
        dispatch({ type: "DELETE_TODO", payload: todo.todo_id });  // Update state after successful deletion
      } catch (err) {
        console.error("Error deleting todo:", err);  // Log error if something goes wrong
      }
    };
    

    const formatDate = (dateString) => {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString("en-US", options);
    };

    return (
      <tr className={`todo-item-row ${todo.completed ? "completed" : ""}`}>
        <td className="circle" onClick={handleComplete}>
          {todo.completed ? "✓" : ""}
        </td>
        <td className="todo-date">{formatDate(todo.created_at)}</td>
        <td className="todo-description">
          {isEditing ? (
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  dispatch({
                    type: "UPDATE_TODO",
                    payload: { ...todo, description: input },
                  });
                  setIsEditing(false);
                }
              }}
              className="form-control"
            />
          ) : (
            <span onClick={() => setIsEditing(true)}>{todo.description}</span>
          )}
        </td>
        <td className="delete-btn-cell">
          <button className="delete-btn" onClick={handleDelete}>
            Delete
          </button>
        </td>
      </tr>
    );
  };
  

export default TodoItem;
