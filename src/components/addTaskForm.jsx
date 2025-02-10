import { Container, TextField, Stack, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'

export default function AddTaskForm({ taskData, onTaskAdded }) {
    const [task, setTask] = useState({
        taskTitle: "",
        taskDescription: ""
    })
    let id, value
    const handleOnChange = (e) => {
        id = e.target.id
        value = e.target.value
        setTask({ ...task, [id]: value })
    }
    const url = import.meta.env.API_URL;


    useEffect(() => {
        if (taskData) {
            setTask({
                taskTitle: taskData.taskTitle,
                taskDescription: taskData.taskDescription,
            });
        } else {
            // Clear the form for adding a new task
            setTask({
                taskTitle: "",
                taskDescription: ""
            });
        }
    }, [taskData]);


    const isEmpty = () => {
        for (const key in task) {
            if (task[key] === "") {
                return true;
            }
        }
        return false;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEmpty()) {
            const emptyField = Object.keys(task).find((key) => task[key] === "");
            document.getElementById(emptyField)?.focus();
            return;
        }

        try {
            const response = await fetch(`${url}/api/v1/tasks/addingTask`,
                {
                    method: "POST",
                    body: JSON.stringify(task),
                    headers: {
                        "Content-Type": "application/json",

                    }
                }
            )
                .then((res) => res.json())
                .then((response) => {
                    setTask({
                        taskTitle: "",
                        taskDescription: ""
                    })
                    onTaskAdded()
                })

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            else {
                console.log("task added");
            }


        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (isEmpty()) {
            const emptyField = Object.keys(task).find(
                (key) => task[key].trim() === ""
            );
            document.getElementById(emptyField)?.focus();
            return;
        }

        const data = {
            _id: taskData._id,
            taskTitle: task.taskTitle,
            taskDescription: task.taskDescription,
        };

        console.log("data", data)

        try {
            const res = await fetch(`${url}/api/v1/tasks/updateTask`, {
                method: "PUT",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });


            const responseData = await res.json();
            console.log("Update response:", responseData);


            setTask({
                taskTitle: "",
                taskDescription: "",
            });


            onTaskAdded();
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };



    return (
        <Stack sx={{ padding: "10px", display: "flex", flexDirection: "column", width: "50%" }} spacing={2}>
            <TextField variant="outlined" label="Add task title" id='taskTitle' name='taskTitle' onChange={handleOnChange} value={task.taskTitle} />
            <TextField variant="outlined" label="Add task descrpiption" id='taskDescription' name='taskDescription' value={task.taskDescription} onChange={handleOnChange} />

            <Button variant='outlined' onClick={taskData ? handleUpdate : handleSubmit}>
                {taskData ? "Update Task" : "Add task"}
            </Button>
        </Stack>

    )
}
