
import { AppBar, Button, Grid2, Container, Card, List, ListItem, ListItemText, IconButton, Checkbox  } from "@mui/material"
import TopBar from "../components/topBar"
import AddTaskForm from "../components/addTaskForm"
import { useEffect, useState } from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'



export default function HomePage() {

    const [tasks, setTasks] = useState([])
    const [isFormVisible, setFormVisble] = useState(false)
    const [taskToEdit, setTaskToEdit] = useState(null);

    const url =  import.meta.env.VITE_API_URL;
    
    

    useEffect(() => {
        // fetch("http://localhost:3001/api/v1/tasks/getTasks")
        fetch(`${url}/api/v1/tasks/getTasks`)

            .then((res) => res.json())
            .then((response) => {
                setTasks(response.data)
                console.log(response.data);

            })
            .catch((error) => console.error("error in fetching task", error))
    }, [])

    const fetchTasks = () => {
        fetch(`${url}/api/v1/tasks/getTasks`)
            .then((res) => res.json())
            .then((response) => {
                setTasks(response.data)

            })
            .catch((error) => console.error("error in fetching task", error))
    }

    const toggleVisblity = (val) => {
        setFormVisble(val)
        if (isFormVisible) {
            setTaskToEdit(null);
        }
    }

    const onDeletClick = (id) => {
        fetch(`${url}/api/v1/tasks/deleteTask/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((res) => res.json())
            .then((response) => {
                console.log("Task deleted:", response);
                fetchTasks();
            })
            .catch((error) => console.error("Error deleting task:", error));

    }

    const onEditClick = (task) =>{
       toggleVisblity(true)
       setTaskToEdit(task);

    }

    const handleCheckboxChange = (id) => {

        const task = tasks.find(t => t._id === id);
        if (!task) return;

        const updatedStatus = !task.isCompleted;
        

        fetch(`${url}/api/v1/tasks/updateIsCompleted`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: id, isCompleted: updatedStatus })
        })
          .then((res) => res.json())
          .then((response) => {
            console.log("Task updated:", response);
        
            fetchTasks();
        
          })
          .catch((error) => console.error("Error updating task", error));
      };
      

    return (
        <div>
            <TopBar />

            <Container sx={{ paddingTop: "100px" }} >
                <Button variant="outlined" onClick={() => toggleVisblity(!isFormVisible)}>Add Task</Button>
                <div>
                    {isFormVisible ? <AddTaskForm taskData={taskToEdit} onTaskAdded={fetchTasks} /> : null}
                </div>


                <List>
                    {

                        [...tasks].reverse().map((task) => {
                            return (
                                <ListItem key={task._id}
                                    secondaryAction={
                                        <div>
                                            <IconButton edge="end" aria-label="delete" onClick={() => onEditClick(task)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" aria-label="delete" onClick={() => onDeletClick(task._id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </div>
                                    }
                                >
                                    <Checkbox
                                        edge="start"
                                        checked={task.isCompleted}
                                        onChange={() => handleCheckboxChange(task._id)}
                                    />
                                    <ListItemText
                                        primary={task.taskTitle}
                                        secondary={task.taskDescription}
                                    />
                                </ListItem>)
                        })
                    }
                </List>

            </Container>
        </div>
    )
}


