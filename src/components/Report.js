import React, {useEffect, useState} from "react";
import {db} from "../firebase";

const Report = () => {

    const [employees,setEmployees] = useState([]);
    const [employee,setEmployee] = useState(null);
    const [month,setMonth] = useState(null);
    const [report,setReport] = useState({
        UdhetimZyretar: {
            count:0,
            dates:[],
        },
        PushimVjetor:{
            count:0,
            dates:[],
        },
        PushimMjekësor:{
            count:0,
            dates:[],
        },
        EventSpecial:{
            count:0,
            dates:[],
        },
    });

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const snapshot = await db.collection('employees').get();
                let data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().firstName + " " + doc.data().lastName,
                    ...doc.data(),
                }));
                console.log(data)
                setEmployees(data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchData();
    },[0])

    useEffect(()=>{
        if(employee && month){
            setReport({
                UdhetimZyretar: {
                    count:0,
                    dates:[],
                },
                PushimVjetor:{
                    count:0,
                    dates:[],
                },
                PushimMjekësor:{
                    count:0,
                    dates:[],
                },
                EventSpecial:{
                    count:0,
                    dates:[],
                },
            })
            employees.forEach((e)=>{
                if(e.name === employee){
                    if(e.fields) {
                        const keys = Object.keys(e.fields);
                        keys.forEach((field) => {
                            if (month == field.slice(6, 7)) {
                                if(e.fields[field] === "Udhetim Zyretar"){
                                    setReport((prevState)=>{
                                        return {
                                            ...prevState,
                                            UdhetimZyretar: {
                                                dates: [...prevState.UdhetimZyretar.dates, field],
                                                count:prevState.UdhetimZyretar.count + 1
                                            }
                                        }
                                    })
                                }else if(e.fields[field] === "Pushim Vjetor"){
                                    setReport((prevState)=>{
                                        return {
                                            ...prevState,
                                            PushimVjetor:{
                                                dates:[...prevState.PushimVjetor.dates,field],
                                                count:prevState.PushimVjetor.count+1
                                            }
                                        }
                                    })
                                }else if(e.fields[field] === "Pushim Mjekësor"){
                                    setReport((prevState)=>{
                                        return {
                                            ...prevState,
                                            PushimMjekësor:{
                                                dates:[...prevState.PushimMjekësor.dates,field],
                                                count:prevState.PushimMjekësor.count+1
                                            }
                                        }
                                    })
                                }else if(e.fields[field] === "Event Special"){
                                    console.log('here')
                                    setReport((prevState)=>{
                                        return {
                                            ...prevState,
                                            EventSpecial:{
                                                dates:[...prevState.EventSpecial.dates,field],
                                                count:prevState.EventSpecial.count+1
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            }
            )
        }
    },[month,employee])

    const monthsAlbania = [
        'Janar',
        'Shkurt',
        'Mars',
        'Prill',
        'Maj',
        'Qershor',
        'Korrik',
        'Gusht',
        'Shtator',
        'Tetor',
        'Nëntor',
        'Dhjetor'
    ];

    return (
        <div style={{display:'flex',flexDirection:"column",width:'100%',justifyContent:'center',alignItems:'center',overflowX:"hidden"}}>
            <div style={{display:'flex',flexDirection:"column",width:'80%',justifyContent:'center',alignItems:'center'}}>
            <h1>Report</h1>
            <div className="d-flex flex-row align-self-start gap-5">
                <select className="form-select" aria-label="Default select example" onChange={(e)=>{setMonth(e.target.value)}}>
                    <option selected>Select Month</option>
                    {monthsAlbania.map((month, index) => (
                        <option key={index} value={index+1}>
                            {month}
                        </option>
                    ))}
                </select>
                <select className="form-select text-black" aria-label="Default select example" onChange={(e)=>{setEmployee(e.target.value)}}>
                    <option selected>Select Employee</option>
                    {employees.map((employee, index) => (
                        <option key={index} value={employee.name}>
                            {employee.name}
                        </option>
                    ))}
                </select>
            </div>
                <div className="d-flex flex-row  mt-5 w-100 justify-content-between overflow-auto">

            <table className="calendar-table mt-5">
                <thead className="thead-dark" >
                <tr>
                    <th scope="col">Udhetim Zyretar</th>
                    <th scope="col">Pushim Vjetor</th>
                    <th scope="col">Pushim Mjekësor</th>
                    <th scope="col">Event Special</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{report.UdhetimZyretar.count}</td>
                        <td>{report.PushimVjetor.count}</td>
                        <td>{report.PushimMjekësor.count}</td>
                        <td>{report.EventSpecial.count}</td>
                    </tr>
                </tbody>
            </table>
                </div>
            <div className="d-flex flex-row  mt-5 w-100 justify-content-between overflow-auto">
            <div>
                <h3>Udhetim Zyretar</h3>
                <table className="calendar-table">
                    <thead className="thead-dark" >
                    <tr>
                        <th scope="col">Dates</th>
                    </tr>
                    </thead>
                    <tbody>
                    {report.UdhetimZyretar.dates && report.UdhetimZyretar.dates.map((date,index)=>{
                        return(
                            <tr key={index}>
                                <td>{date}</td>
                            </tr>
                        )

                    }
                    )}
                    </tbody>
                </table>
            </div>
            <div>
                <h3>Pushim Vjetor</h3>
                <table className="calendar-table">
                    <thead className="thead-dark" >
                    <tr>
                        <th scope="col">Dates</th>
                    </tr>
                    </thead>
                    <tbody>
                    {report.PushimVjetor.dates && report.PushimVjetor.dates.map((date,index)=>{
                        return(
                            <tr key={index}>
                                <td>{date}</td>
                            </tr>
                        )

                    })
                    }
                    </tbody>
                </table>
            </div>
            <div>
                <h3>Pushim Mjekësor</h3>
                <table className="calendar-table">
                    <thead className="thead-dark" >
                    <tr>
                        <th scope="col">Dates</th>
                    </tr>
                    </thead>
                    <tbody>
                    {report.PushimMjekësor.dates && report.PushimMjekësor.dates.map((date,index)=>{
                        return(
                            <tr key={index}>
                                <td>{date}</td>
                            </tr>
                        )
                    })
                    }
                    </tbody>
                </table>
            </div>
            <div>
                <h3>Event Special</h3>
                <table className="calendar-table">
                    <thead className="thead-dark" >
                    <tr>
                        <th scope="col">Dates</th>
                    </tr>
                    </thead>
                    <tbody>
                    {report.EventSpecial.dates && report.EventSpecial.dates.map((date,index)=>{
                        return(
                            <tr key={index}>
                                <td>{date}</td>
                            </tr>
                        )
                    })
                    }
                    </tbody>
                </table>
            </div>
            </div>

            </div>
        </div>
        )
}

export default Report