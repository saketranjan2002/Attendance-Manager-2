import React, {useState, useEffect} from 'react'
import axios from "axios"
import { useDispatch } from 'react-redux'
import toast from "react-hot-toast"
import { useNavigate } from 'react-router-dom'

import Card from "../../components/Card/Card"
import Dashboard from '../../components/Dashboard/Dashboard'
import Tables from "../../components/Tables/Table"
import { loadingActions } from '../../store/loadingSlice'
import Modal from "../../components/Modal/Modal"

import classes from "./AdminDashboard.module.css"

function AdminDashboard() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [tableData, setTableData] = useState([]);
    const [columns , setColumns] = useState([]);

    let [students,setStudents] = useState([]);
    let [courses,setCourses] = useState([]);
    let [teachers,setTeachers] = useState([]);
    let [admins, setAdmins] = useState([]);
    let [showModal,setShowModal] = useState(true)

    const getData = async () => {

        try{

            dispatch(loadingActions.showLoading())

            const crs = await axios.get("api/getClasses")
            const stds = await axios.get("api/getStudents")
            const teach = await axios.get("api/getTeachers")
            const adm = await axios.get("api/getAdmins")

            dispatch(loadingActions.hideLoading())

            if(stds.data.success){
                setStudents(stds.data.data);
            }

            if(crs.data.success){
                // console.log("success");
                setCourses(crs.data.data);
            }

            if(teach.data.success){
                setTeachers(teach.data.data);
            }

            if(adm.data.success){
                setAdmins(adm.data.data);
            }

        }catch(err){

            dispatch(loadingActions.hideLoading())
            console.log(err);
        }
    }

    useEffect(() => {
        getData();
    },[]);

    const courseColumns = [
        {
            Header: "Name",
            accessor: "name"
        },
        {
            Header: "Students",
            accessor: "students",
            Cell: ({value}) => {
                let count = value.length;

                return(
                    <div>{count}</div>
                );
            }
        },
        {
            Header: "Teachers",
            accessor: "teachers",
            Cell: ({value}) => {
                let count = value.length;

                return(
                    <div>{count}</div>
                );
            }
        },
        {
            Header: "Actions",
            accessor: "actions",
            Cell: (cdata) => {

                const caller = () => {
                    removeCourses(cdata.cell.row.index)
                }
                return (<button onClick = {caller} >Remove Course</button>);
            }
        }

    ]

    const studentColumns = [
        {
            Header: "Name",
            accessor: "name"
        },
        {
            Header: "Roll No.",
            accessor: "roll_number"
        },
        {
            Header: "Email",
            accessor: "email"
        },
        {
            Header: "Actions",
            accessor: "actions",
            Cell: (cdata) => {

                const caller = () => {
                    removeStudent(cdata.cell.row.index)
                }
                // console.log(cdata.cell.row.index)
                return(<button onClick = {caller}>Remove Student</button>);
            }
        }
    ]

    const teacherColumns = [
        {
            Header: "Name",
            accessor: "name"
        },
        {
            Header: "Email",
            accessor: "email"
        },
        {
            Header: "Actions",
            accessor: "actions",
            Cell: (cdata) => {

                const caller = () => {
                    removeTeacher(cdata.cell.row.index)
                }
                return(<button onClick = {caller}>Remove Teacher</button>);
            }
        }
    ]

    const adminColumns = [
        {
            Header: "Name",
            accessor: "name"
        },
        {
            Header: "Email",
            accessor: "email"
        },
        {
            Header: "Actions",
            accessor: "actions",
            Cell: (cdata) => {

                const caller = () => {
                    removeAdmin(cdata.cell.row.index)
                }
                return(<button onClick = {caller}>Remove Admin</button>);
            }
        }
    ]

    const removeStudent = async (idx) => {
        try {
            
            const std = students[idx];

            const res = await axios.get("/admin/removeStudent/" + std._id)

            if(res.data.success){
                toast.success("Student removed")
                navigate(0);
            }
            else{
                toast.error("Deletion Failed")
            }
            
        } catch (error) {
            console.log("Student delete error")
            console.log(error);

            toast.error("Something went Wrong")
        }
    }

    const removeTeacher = async (idx) => {
        try {
            
            const teach = teachers[idx];

            const res = await axios.get("/admin/removeTeacher/" + teach.email)

            if(res.data.success){
                toast.success("Teacher removed")
                navigate(0);
            }
            else{
                toast.error("Deletion Failed")
            }
            
        } catch (error) {
            console.log("Student delete error")
            console.log(error);

            toast.error("Something went Wrong")
        }
    }

    const removeCourses = async (idx) => {
        try {
            
            const crs = courses[idx];

            const res = await axios.get("/admin/removeCourse/" + crs._id)

            if(res.data.success){
                toast.success("Course Removed")
                navigate(0);
            }
            else{
                toast.error("Deletion Failed")
            }
            
        } catch (error) {
            console.log("Student delete error")
            console.log(error);

            toast.error("Something went Wrong")
        }
    }

    const removeAdmin = async (idx) => {
        try {
            
            const adm = admins[idx];

            const res = await axios.post("/admin/remove",{
                id:adm._id
            })

            if(res.data.success){
                toast.success("Admin removed")
                navigate(0);
            }
            else{
                toast.error("Deletion Failed")
            }
            
        } catch (error) {
            console.log("Student delete error")
            console.log(error);

            toast.error("Something went Wrong")
        }
    }

    const addAdmin = () => {

    }

    const showCoursesHandler = async () => {
        try {
            // const res = await axios.get("api/getClasses")
            setColumns(courseColumns);
            setTableData(courses);

        } catch (error) {
            console.log("Error = " + error);
        }
    }

    const showStudentsHandler = async () => {
        try {
            setColumns(studentColumns)
            setTableData(students)
            
        } catch (error) {
            console.log(error)
        }
    }

    const showTeachersHandler = async () => {
        try {
            setColumns(teacherColumns)
            setTableData(teachers)
        } catch (error) {
            console.log(error)
        }
    }

    const showAdminsHandler = async () => {
        try {
            setColumns(adminColumns)
            setTableData(admins)
            
        } catch (error) {
            console.log(error);
        }
    }

    const openModal = () => {
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
    }

    return (
        <div>
            <Dashboard>
                {showModal && 
                    <Modal closeModal = {closeModal}>
                        <form className = {classes.form}>
                            <div className = {classes.input}>
                                <label htmlFor="full_name">Full Name: </label>
                                <input type="text" id="full_name" />
                            </div>
                            <div className = {classes.input}>
                                <label htmlFor="email">Email: </label>
                                <input type="text" id="email" />
                            </div>
                            <div className = {classes.input}>
                                <label htmlFor="password">Password: </label>
                                <input type="text" id="password" />
                            </div>
                            <div className = {classes.input}>
                                <label htmlFor="admin_passowrd">Admin Passowrd: </label>
                                <input type="text" id="admin_passowrd" />
                            </div>

                            <button type="submit">Add Admin</button>
                        </form>
                    </Modal>
                }
                <Card>
                    {/* Buttons */}
                    <div className = {classes.adminActions}>
                        <button onClick = {openModal}>Add new admin</button>
                    </div>

                    {/* Summary */}
                    <div className = {classes.summary}>
                        <div className={classes["card"]}>
                            <p>Number of Students</p>
                            <p>{students.length}</p>
                        </div>
                        <div className={classes["card"]}>
                            <p>Number of Teachers</p>
                            <p>{teachers.length}</p>
                        </div>
                        <div className={classes["card"]}>
                            <p>Number of Courses</p>
                            <p>{courses.length}</p>
                        </div>
                    </div>

                    {/* Tabs */}

                    <div className={classes["tabs"]}>
                        <div className={classes["menu"]}>
                            <input className = {classes["radio_input"]} type="radio" name="radio" id="student" />
                            <label className = {classes["radio_label"]} htmlFor="student" onClick = {showStudentsHandler}>Students</label>

                            <input className = {classes["radio_input"]} type="radio" name="radio" id="teachers" />
                            <label className = {classes["radio_label"]} htmlFor="teachers" onClick = {showTeachersHandler}>Teachers</label>

                            <input className = {classes["radio_input"]} type="radio" name="radio" id="Courses" />
                            <label className = {classes["radio_label"]} htmlFor="Courses" onClick = {showCoursesHandler}>Courses</label>

                            <input className = {classes["radio_input"]} type="radio" name="radio" id="admins" />
                            <label className = {classes["radio_label"]} htmlFor="admins" onClick = {showAdminsHandler}>Admins</label>
                        </div>
                        <div className={classes["content"]}>
                            {(columns !== [])? <Tables data = {tableData} columns = {columns}/>: <h2>Loading...</h2>}
                        </div>
                    </div>
                </Card>
            </Dashboard>
        </div>
    )
}

export default AdminDashboard