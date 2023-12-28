"use client"
import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart';
import './ReportPage.css'
import { AiFillEdit } from 'react-icons/ai'
import CaloriIntakePopup from '@/components/ReportFormPopup/CalorieIntake/CalorieIntakePopup';
import SleepEntryPopup from '@/components/ReportFormPopup/SleepEntry/SleepEntryPopup'; 
import StepsPopup from '@/components/ReportFormPopup/WalkingSteps/StepsTrackPopup';
import WaterIntakePopup from '@/components/ReportFormPopup/WaterIntake/WaterIntakePopup';
import WeightGainPopup from '@/components/ReportFormPopup/WeightGain/WeightGainPopup';
import { usePathname } from 'next/navigation';

const page = () => {
    const color = '#ffc20e'
    const pathname = usePathname()
    console.log(pathname);
    const [showCalorieIntakePopup, setShowCalorieIntakePopup] = React.useState<boolean>(false)
    const [showSleepEntryPopup, setShowSleepEntryPopup] = React.useState<boolean>(false)
    const [showStepsPopup, setShowStepsPopup] = React.useState<boolean>(false)
    const [showWaterIntakePopup, setShowWaterIntakePopup] = React.useState<boolean>(false)
    const [showWeightGainPopup, setShowWeightGainPopup] = React.useState<boolean>(false)

    const chartsParams = {
        // margin: { bottom: 20, left: 25, right: 5 },
        height: 400,
        width: 600
    };

    const [dataS1, setDataS1] = React.useState<any>(null)
    const [dataS2, setDataS2] = React.useState<any>(null)
    const [dataS3, setDataS3] = React.useState<any>(null)
    const [dataS4, setDataS4] = React.useState<any>(null)
    const [dataS5, setDataS5] = React.useState<any>(null)

    const getDataForS1 = async () => {

        if(pathname =='/report/Calorie%20Intake') {
            fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/getcalorieintakebylimit', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ limit: 10 })
            })
            .then(res => res.json())
            .then(data => {
                if(data.ok) {
                    let temp = data.data.map((item: any) => {
                        return {
                            date: item.date,
                            value: item.calorieIntake,
                            unit: 'kcal'
                        }
                    })
                    console.log(temp+'temp')

                    let dataForLineChart = temp.map((item: any) => {
                        let val = JSON.stringify(item.value)
                        return val
                    })

                    let dataForXAxis = temp.map((item: any) => {
                        let val = new Date(item.date)
                        return val
                    })

                    setDataS1({
                        data: dataForLineChart,
                        title: '1 Item Calorie Intake',
                        color: color,
                        xAxis: {
                            data: dataForXAxis,
                            label: 'Last 10 Days',
                            scaleType: 'time'
                        }
                    })
                }
                else{
                    setDataS1([])
                }
            })
            .catch (err => {
                console.log(err)
            })
        }

    }

    const getDataForS2 = async () => {
        if(pathname == '/report/Sleep') {
            fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/getsleepbylimit', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ limit: 10 })
            })
            .then(res => res.json())
            .then(data => {
                if(data.ok) {
                    // console.log(data+'dataissi')
                    let temp = data.data.map((item: any) => {
                        return {
                            date: item.date,
                            value: item.durationInHrs,
                            unit: 'hrs'
                        }
                    })
                    console.log(temp+'temp')


                    let dataForLineChartSleep = temp.map((item: any) => {
                        let val = JSON.stringify(item.value)
                        return val
                    })

                    let dataForXAxisSleep = temp.map((item: any) => {
                        let val = new Date(item.date)
                        return val
                    })

                    setDataS2({
                        data: dataForLineChartSleep,
                        title: '1 day sleep duration',
                        color: color,
                        xAxis: {
                            data: dataForXAxisSleep,
                            label: 'Last 10 Days',
                            scaleType: 'time'
                        }
                    })
                }
                else {
                    setDataS2([])
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    const getDataForS3 = async () => {
        if(pathname == '/report/Steps') {
            fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/getstepsbylimit', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ limit: 10 })
            })
            .then(res => res.json())
            .then(data => {
                if(data.ok) {
                    console.log(data)
                    let temp = data.data.map((item: any) => {
                        return {
                            date: item.date,
                            value: item.steps,
                            unit: 'steps'
                        }
                    })
                    console.log(temp+'temp')


                    let dataForLineChartStep = temp.map((item: any) => {
                        let val = JSON.stringify(item.value)
                        return val
                    })

                    let dataForXAxisStep = temp.map((item: any) => {
                        let val = new Date(item.date)
                        return val
                    })

                    setDataS3({
                        data: dataForLineChartStep,
                        title: '1 day total steps',
                        color: color,
                        xAxis: {
                            data: dataForXAxisStep,
                            label: 'Last 10 Days',
                            scaleType: 'time'
                        }
                    })
                }
                else {
                    setDataS3([])
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    const getDataForS4 = async () => {
        if(pathname == '/report/Water') {
            fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/getwaterbylimit', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ limit: 10 })
            })
            .then(res => res.json())
            .then(data => {
                if(data.ok) {
                    console.log(data)
                    let temp = data.data.map((item: any) => {
                        return {
                            date: item.date,
                            value: item.amountInMilliliters,
                            unit: 'ml'
                        }
                    })
                    console.log(temp+'temp')


                    let dataForLineChartWater = temp.map((item: any) => {
                        let val = JSON.stringify(item.value)
                        return val
                    })

                    let dataForXAxisWater = temp.map((item: any) => {
                        let val = new Date(item.date)
                        return val
                    })

                    setDataS4({
                        data: dataForLineChartWater,
                        title: '1 day water intake',
                        color: color,
                        xAxis: {
                            data: dataForXAxisWater,
                            label: 'Last 10 Days',
                            scaleType: 'time'
                        }
                    })
                }
                else {
                    setDataS4([])
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    const getDataForS5 = async () => {
        if(pathname == '/report/Weight') {
            fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/getweightbylimit', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ limit: 10 })
            })
            .then(res => res.json())
            .then(data => {
                if(data.ok) {
                    console.log(data)
                    let temp = data.data.map((item: any) => {
                        return {
                            date: item.date,
                            value: item.weightInKg,
                            unit: 'kg'
                        }
                    })
                    console.log(temp+'temp')


                    let dataForLineChartWeight = temp.map((item: any) => {
                        let val = JSON.stringify(item.value)
                        return val
                    })

                    let dataForXAxisWeight = temp.map((item: any) => {
                        let val = new Date(item.date)
                        return val
                    })

                    setDataS5({
                        data: dataForLineChartWeight,
                        title: '1 day Weight',
                        color: color,
                        xAxis: {
                            data: dataForXAxisWeight,
                            label: 'Last 10 Days',
                            scaleType: 'time'
                        }
                    })
                }
                else {
                    setDataS5([])
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    React.useEffect(() => {
        if(pathname == '/report/Calorie%20Intake') {
            getDataForS1();
        }
        else if(pathname == '/report/Sleep'){
            getDataForS2();
        }
        else if(pathname == '/report/Steps') {
            getDataForS3();
        }
        else if(pathname == '/report/Water') {
            getDataForS4();
        }
        else if(pathname == '/report/Weight') {
            getDataForS5();
        }
        else{
            alert('Show popup for others')
        }
    }, [])

    

    return (
        <div className='reportpage'>

            <div className="s1">
            {
                dataS1 &&
                <LineChart
                    xAxis={[{
                        id: 'Day',
                        data: dataS1.xAxis.data,
                        scaleType: dataS1.xAxis.scaleType,
                        label: dataS1.xAxis.label,
                        
                    }]}
                    series={[
                        {
                            data: dataS1.data,
                            label: dataS1.title,
                            color: dataS1.color,
                        },
                    ]}
                    {...chartsParams}
                />
            }
            </div>

            <div className="s1">
            {
                dataS2 &&
                <LineChart 
                    xAxis={[{
                        id: 'Day',
                        data: dataS2.xAxis.data,
                        scaleType: dataS2.xAxis.scaleType,
                        label: dataS2.xAxis.label,
                    }]}
                    series={[{
                        data: dataS2.data,
                        label: dataS2.title,
                        color: dataS2.color,
                    }]}
                    {...chartsParams}
                />
                }
            </div>
        
            <div className="s1">
            {
                dataS3 &&
                <LineChart 
                    xAxis={[{
                        id: 'Day',
                        data: dataS3.xAxis.data,
                        scaleType: dataS3.xAxis.scaleType,
                        label: dataS3.xAxis.label,
                    }]}
                    series={[{
                        data: dataS3.data,
                        label: dataS3.title,
                        color: dataS3.color,
                    }]}
                    {...chartsParams}
                />
                }
            </div>

            <div className="s1">
            {
                dataS4 &&
                <LineChart 
                    xAxis={[{
                        id: 'Day',
                        data: dataS4.xAxis.data,
                        scaleType: dataS4.xAxis.scaleType,
                        label: dataS4.xAxis.label,
                    }]}
                    series={[{
                        data: dataS4.data,
                        label: dataS4.title,
                        color: dataS4.color,
                    }]}
                    {...chartsParams}
                />
                }
            </div>

            <div className="s1">
            {
                dataS5 &&
                <LineChart 
                    xAxis={[{
                        id: 'Day',
                        data: dataS5.xAxis.data,
                        scaleType: dataS5.xAxis.scaleType,
                        label: dataS5.xAxis.label,
                    }]}
                    series={[{
                        data: dataS5.data,
                        label: dataS5.title,
                        color: dataS5.color,
                    }]}
                    {...chartsParams}
                />
                }
            </div>
        
            <button className='editbutton' 
                onClick={() => {
                    if(pathname == '/report/Calorie%20Intake') {
                        setShowCalorieIntakePopup(true)
                    }
                    else if(pathname == '/report/Sleep'){
                        setShowSleepEntryPopup(true)
                    }
                    else if(pathname == '/report/Steps'){
                        setShowStepsPopup(true)
                    }
                    else if(pathname == '/report/Water'){
                        setShowWaterIntakePopup(true)
                    }
                    else if(pathname == '/report/Weight'){
                        setShowWeightGainPopup(true)
                    }
                    else{
                        alert('show popup for other')
                    }

                }}
            >    
                <AiFillEdit />
            </button>
            {
                showCalorieIntakePopup &&
                <CaloriIntakePopup setShowCalorieIntakePopup={setShowCalorieIntakePopup} />
                }

            {
                showSleepEntryPopup &&
                <SleepEntryPopup setShowSleepEntryPopup={setShowSleepEntryPopup} />
            }    

            {
                showStepsPopup &&
                <StepsPopup setShowStepsPopup={setShowStepsPopup} />
            }

            {
                showWaterIntakePopup && 
                <WaterIntakePopup setShowWaterIntakePopup={setShowWaterIntakePopup} />
            }

            {
                showWeightGainPopup && 
                <WeightGainPopup setShowWeightGainPopup={setShowWeightGainPopup} />
            }
        </div>
    )
}

export default page