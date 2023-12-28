"use client"
import React from 'react'
import '../Popup.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai'
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { toast } from 'react-toastify';

interface WaterIntakePopupProps {
    setShowWaterIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const WaterIntakePopup: React.FC<WaterIntakePopupProps> = ({ setShowWaterIntakePopup }) => {
    const color = "#ffc20e"

    const [date, setDate] = React.useState<any>(dayjs(new Date()))
    const [time, setTime] = React.useState<any>(dayjs(new Date()))

    const [WaterIntake, setWaterIntake] = React.useState<any>({
        date: '',
        amountInMilliliters: ''
    })

    const [items, setItems] = React.useState<any>([])

    const saveWaterIntake = async () => {
      let tempdate = date.format('YYYY-MM-DD')
      let temptime = time.format('HH:mm:ss')
      let tempdatetime = tempdate + ' ' + temptime
      let finaldatetime = new Date(tempdatetime) 
      
      console.log(finaldatetime)

      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/addwaterentry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/JSON',
        },
        credentials: 'include',
        body: JSON.stringify({
          date: finaldatetime,
          amountInMilliliters: WaterIntake.amountInMilliliters
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.ok) {
          toast.success('success adding water intake')
          getWaterIntake()
        }
        else{
          toast.error('failure adding water intake')
        }
      })
      .catch((err) => {
        toast.error('error in fetching water intake')
        console.log(err)
      })

    }
    const getWaterIntake = async () => {
      setItems([])
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/getwaterbydate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          date: date
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.ok) {
          console.log(data.data, 'water intake for date')
          setItems(data.data)
        }
        else {
          toast.error('Error in getting water intake')
        }
      })
      .catch(err => {
        toast.error('Error in getting water intake')
        console.log(err)
      })
    }

    const deleteWaterIntake = async (item: any) => {
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/deletewaterentry', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          item: item.item,
          date: item.date
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.ok) {
          toast.success('Water Intake deleted successfully')
          getWaterIntake()
        }
        else{
          toast.error('Error in deleting Water Intake')
        }
      })
      .catch(err => {
        toast.error('Error in deleting Water Intake')
        console.log(err)
      })
    }

    React.useEffect(() => {
        getWaterIntake()
    }, [date])

    const selectedDay = (val: any) => {
      setDate(val)
    };

  return (
    <div className='popupout'>
      <div className="popupbox">
        <button className="close" 
          onClick={() => {
            setShowWaterIntakePopup(false)
          }} 
        >
          <AiOutlineClose />
        </button>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={date}
              onChange={(newValue) => {
                selectedDay(newValue);
            }} />
        </LocalizationProvider>

        <div className='timebox'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TimePicker
            label="Time picker"
            value={time}
            onChange={(newValue) => {
              setTime(newValue)
            }}
          />
          </LocalizationProvider>
        </div>

        <TextField type='number' id="outlined-basic" label="Water drank(in ml)" variant="outlined" color="warning" 
          onChange={(e) => {
            setWaterIntake({
              ...WaterIntake,
              amountInMilliliters: e.target.value
            })
          }}
        />

        <Button variant="contained" color="warning" onClick={saveWaterIntake}>Save</Button>

        <div className='hrline'></div>
        <div className='items'>
          {
            items.map((item: any) => {
              return(
                <div className="item">
                  <h3>{item.amountInMilliliters} ml</h3>
                  <h3>{item.date}</h3>
                  <button 
                   onClick={() => {
                    deleteWaterIntake(item)
                   }} 
                  ><AiFillDelete /></button>
                </div>
                
              )
            })
          }

        </div>
      </div>
    </div>
  )
}

export default WaterIntakePopup
