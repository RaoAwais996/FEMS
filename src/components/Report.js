import React, {useEffect, useState} from "react";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import {db} from "../firebase";

const Report = () => {

    const [employees, setEmployees] = useState([]);
    const [employee, setEmployee] = useState(null);
    const [event, setEvent] = useState(null);
    const [count,setCount] = useState([]);
    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [report, setReport] = useState({
        UdhetimZyretar: {
            count: 0, dates: [],
        }, PushimVjetor: {
            count: 0, dates: [],
        }, PushimMjekësor: {
            count: 0, dates: [],
        }, EventSpecial: {
            count: 0, dates: [],
        }, PrezentNePune: {
            count: 0, dates: [],
        }, DiteELire: {
            count: 0, dates: [],
        }
    });

    function handleCallback(start, end, label) {
        setStart(start)
        setEnd(end)
    }

    useEffect(() => {

        const name = localStorage.getItem('name');
        const fetchData = async () => {
            try {
                const snapshot = await db.collection('employees').get();
                let data = snapshot.docs.map((doc) => {
                    if (name) {
                        if (doc.data().firstName + " " + doc.data().lastName === name) {
                            setEmployee(name)
                        }
                    }
                    return ({
                        id: doc.id, name: doc.data().firstName + " " + doc.data().lastName, ...doc.data(),
                    })
                });
                data = data?.sort((a, b) => (a.sr > b.sr ? 1 : -1))
                setEmployees(data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchData();
    }, [0])

    useEffect(() => {
        employees.forEach((e) => {
            setCount((prevState)=>{
                return {
                    ...prevState,[e.name]:{
                        count:0
                    }
                }
            })
        })
    }, [employees]);

    useEffect(() => {
        if (employee && start && end) {
            setReport({
                UdhetimZyretar: {
                    count: 0, dates: [],
                }, PushimVjetor: {
                    count: 0, dates: [],
                }, PushimMjekësor: {
                    count: 0, dates: [],
                }, EventSpecial: {
                    count: 0, dates: [],
                }, PrezentNePune: {
                    count: 0, dates: [],
                }, DiteELire: {
                    count: 0, dates: [],
                }
            })
            employees.forEach((e) => {
                setCount((prevState)=>{
                    return {
                        ...prevState,[e.name]:{
                            count:0
                        }
                    }
                })
            })
            employees.forEach((e) => {
                if (employee === 'all') {
                    if(e.fields){
                        const keys = Object.keys(e.fields);
                        keys.forEach((field) => {
                          if(e.fields[field] === event){
                              if(count[e.name] === undefined){
                                    setCount((prevState) => {
                                        return {
                                            ...prevState, [e.name]: {
                                                count: 1
                                            }
                                        }
                                    })
                              }
                              setCount((prevState) => {
                                  return {
                                      ...prevState, [e.name]: {
                                          count: prevState[e.name].count + 1
                                      }
                                  }
                              })
                          }
                        })
                    }
                } else if (e.name === employee) {
                    if (e.fields) {
                        console.log(e.fields)
                        const keys = Object.keys(e.fields);
                        keys.forEach((field) => {
                            if (new Date(field) >= new Date(start) && new Date(field) <= new Date(end)) {
                                if (e.fields[field] === "Udhëtim Zyrëtar") {
                                    setReport((prevState) => {
                                        return {
                                            ...prevState, UdhetimZyretar: {
                                                dates: [...prevState.UdhetimZyretar.dates, field],
                                                count: prevState.UdhetimZyretar.count + 1
                                            }
                                        }
                                    })
                                } else if (e.fields[field] === "Pushim Vjetor") {
                                    setReport((prevState) => {
                                        return {
                                            ...prevState, PushimVjetor: {
                                                dates: [...prevState.PushimVjetor.dates, field],
                                                count: prevState.PushimVjetor.count + 1
                                            }
                                        }
                                    })
                                } else if (e.fields[field] === "Pushim Mjekësor") {
                                    setReport((prevState) => {
                                        return {
                                            ...prevState, PushimMjekësor: {
                                                dates: [...prevState.PushimMjekësor.dates, field],
                                                count: prevState.PushimMjekësor.count + 1
                                            }
                                        }
                                    })
                                } else if (e.fields[field] === "Event Special") {
                                    console.log('here')
                                    setReport((prevState) => {
                                        return {
                                            ...prevState, EventSpecial: {
                                                dates: [...prevState.EventSpecial.dates, field],
                                                count: prevState.EventSpecial.count + 1
                                            }
                                        }
                                    })
                                } else if (e.fields[field] === "Prezent në punë") {
                                    setReport((prevState) => {
                                        return {
                                            ...prevState, PrezentNePune: {
                                                dates: [...prevState.PrezentNePune.dates, field],
                                                count: prevState.PrezentNePune.count + 1
                                            }
                                        }
                                    })
                                } else if (e.fields[field] === "Ditë e lirë") {
                                    setReport((prevState) => {
                                        return {
                                            ...prevState, DiteELire: {
                                                dates: [...prevState.DiteELire.dates, field],
                                                count: prevState.DiteELire.count + 1
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        }
    }, [start, end, employee,event])

    const monthsAlbania = ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'];

    return (
        <div style={{
            display: 'flex',
            flexDirection: "column",
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            overflowX: "hidden"
        }}>
            <div style={{
                display: 'flex', flexDirection: "column", width: '80%', justifyContent: 'center', alignItems: 'center'
            }}>
                <h1 className="mb-4">Report</h1>
                <div className="d-flex flex-row align-self-start gap-5">
                    <DateRangePicker onCallback={handleCallback}>
                        <input type="text" className="form-control"/>
                    </DateRangePicker>
                    <select disabled={localStorage.getItem('userType') === 'employee'} value={employee}
                            className="form-select text-black" aria-label="Default select example" onChange={(e) => {
                        setEmployee(e.target.value)
                    }}>
                        <option selected>Select Employee</option>
                        <option value="all">All</option>
                        {employees.map((employee, index) => (<option key={index} value={employee.name}>
                            {employee.name}
                        </option>))}
                    </select>
                    {
                        employee === "all" &&
                        <select value={event} className="form-select text-black" onChange={(e) => {
                            setEvent(e.target.value)
                        }}>
                            <option selected>Select Event</option>
                            <option value="Udhëtim Zyrëtar">Udhëtim Zyrëtar</option>
                            <option value="Pushim Vjetor">Pushim Vjetor</option>
                            <option value="Pushim Mjekësor">Pushim Mjekësor</option>
                            <option value="Event Special">Event Special</option>
                            <option value="Prezent në punë">Prezent në punë</option>
                            <option value="Ditë e lirë">Ditë e lirë</option>
                        </select>
                    }
                </div>
                {employee === "all" && event &&
                    <div className=" d-flex flex-row  mt-5 w-100 justify-content-between overflow-auto">
                        <table className="calendar-table-r mt-5 ">
                            <thead className="thead-dark">
                            <tr>
                                <th scope="col">Employee Name</th>
                                <th scope="col">Count</th>
                            </tr>
                            </thead>
                            <tbody>
                            {employees.map((employee, index) => {
                                    return (<tr key={index}>
                                        <td>{employee.name}</td>
                                        <td>{count[employee.name].count?count[employee.name].count:0}</td>
                                    </tr>)
                                }
                            )}
                            </tbody>
                        </table>
                    </div>
                }
                {employee !== "all" && <>
                    <div className="d-flex flex-row  mt-5 w-100 justify-content-between overflow-auto">
                        <table className="calendar-table-r mt-5 responsive-desktop-table">
                            <thead className="thead-dark">
                            <tr>
                                <th scope="col">Udhetim Zyretar</th>
                                <th scope="col">Pushim Vjetor</th>
                                <th scope="col">Pushim Mjekësor</th>
                                <th scope="col">Event Special</th>
                                <th scope="col">Ditë e lirë</th>
                                <th scope="col">Prezent në punë</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{report.UdhetimZyretar.count}</td>
                                <td>{report.PushimVjetor.count}</td>
                                <td>{report.PushimMjekësor.count}</td>
                                <td>{report.EventSpecial.count}</td>
                                <td>{report.DiteELire.count}</td>
                                <td>{report.PrezentNePune.count}</td>
                            </tr>
                            </tbody>
                        </table>
                        <table className="calendar-table-r calendar-table-r-m responsive-mobile-table">
                            <thead className="thead-dark">
                            <tr>
                                <th scope="col">Event</th>
                                <th scope="col">Count</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <th>Udhetim Zyretar</th>
                                <td>{report.UdhetimZyretar.count}</td>
                            </tr>
                            <tr>
                                <th>Pushim Vjetor</th>
                                <td>{report.PushimVjetor.count}</td>
                            </tr>
                            <tr>
                                <th>Pushim Mjekësor</th>
                                <td>{report.PushimMjekësor.count}</td>
                            </tr>
                            <tr>
                                <th>Event Special</th>
                                <td>{report.EventSpecial.count}</td>
                            </tr>
                            <tr>
                                <th>Ditë e lirë</th>
                                <td>{report.DiteELire.count}</td>
                            </tr>
                            <tr>
                                <th>Prezent në punë</th>
                                <td>{report.PrezentNePune.count}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="d-flex flex-row  mt-5 w-100 justify-content-between overflow-auto">
                        <div>
                            <h3>Udhetim Zyretar</h3>
                            <table className=" calendar-table-r">
                                <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Dates</th>
                                </tr>
                                </thead>
                                <tbody>
                                {report.UdhetimZyretar.dates && report.UdhetimZyretar.dates.map((date, index) => {
                                    return (<tr key={index}>
                                        <td>{date}</td>
                                    </tr>)

                                })}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3>Pushim Vjetor</h3>
                            <table className=" calendar-table-r">
                                <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Dates</th>
                                </tr>
                                </thead>
                                <tbody>
                                {report.PushimVjetor.dates && report.PushimVjetor.dates.map((date, index) => {
                                    return (<tr key={index}>
                                        <td>{date}</td>
                                    </tr>)

                                })}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3>Pushim Mjekësor</h3>
                            <table className=" calendar-table-r">
                                <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Dates</th>
                                </tr>
                                </thead>
                                <tbody>
                                {report.PushimMjekësor.dates && report.PushimMjekësor.dates.map((date, index) => {
                                    return (<tr key={index}>
                                        <td>{date}</td>
                                    </tr>)
                                })}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3>Event Special</h3>
                            <table className=" calendar-table-r">
                                <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Dates</th>
                                </tr>
                                </thead>
                                <tbody>
                                {report.EventSpecial.dates && report.EventSpecial.dates.map((date, index) => {
                                    return (<tr key={index}>
                                        <td>{date}</td>
                                    </tr>)
                                })}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3>Ditë e lirë</h3>
                            <table className=" calendar-table-r">
                                <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Dates</th>
                                </tr>
                                </thead>
                                <tbody>
                                {report.DiteELire.dates && report.DiteELire.dates.map((date, index) => {
                                    return (<tr key={index}>
                                        <td>{date}</td>
                                    </tr>)
                                })}
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <h3>Prezent në punë</h3>
                            <table className=" calendar-table-r">
                                <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Dates</th>
                                </tr>
                                </thead>
                                <tbody>
                                {report.PrezentNePune.dates && report.PrezentNePune.dates.map((date, index) => {
                                    return (<tr key={index}>
                                        <td>{date}</td>
                                    </tr>)
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>}
            </div>
        </div>)
}

export default Report