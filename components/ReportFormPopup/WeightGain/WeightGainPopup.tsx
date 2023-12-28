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

interface WeightGainPopupProps {
    setShowWeightGainPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const WeightGainPopup: React.FC<WeightGainPopupProps> = ({ setShowWeightGainPopup }) => {
    const color = "#ffc20e"

    const [date, setDate] = React.useState<any>(dayjs(new Date()))
    const [time, setTime] = React.useState<any>(dayjs(new Date()))

    const [WeightGain, setWeightGain] = React.useState<any>({
        date: '',
        weightInKg: ''
    })

    const [items, setItems] = React.useState<any>([])

    const saveWeightGain = async () => {
      let tempdate = date.format('YYYY-MM-DD')
      let temptime = time.format('HH:mm:ss')
      let tempdatetime = tempdate + ' ' + temptime
      let finaldatetime = new Date(tempdatetime) 
      
      console.log(finaldatetime)

      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/addweightentry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/JSON',
        },
        credentials: 'include',
        body: JSON.stringify({
          date: finaldatetime,
          weightInKg: WeightGain.weightInKg
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.ok) {
          toast.success('success adding Weight')
          getWeightGain()
        }
        else{
          toast.error('failure adding weight')
        }
      })
      .catch((err) => {
        toast.error('error in fetching weight')
        console.log(err)
      })

    }
    const getWeightGain = async () => {
      setItems([])
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/getweightbydate', {
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
          console.log(data.data, 'weight for date')
          setItems(data.data)
        }
        else {
          toast.error('Error in getting weight for date')
        }
      })
      .catch(err => {
        toast.error('Error in getting weight for date')
        console.log(err)
      })
    }

    const deleteWeightGain = async (item: any) => {
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/deleteweightentry', {
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
          toast.success('Weight deleted successfully')
          getWeightGain()
        }
        else{
          toast.error('Error in deleting Weight')
        }
      })
      .catch(err => {
        toast.error('Error in deleting Weight')
        console.log(err)
      })
    }

    React.useEffect(() => {
        getWeightGain()
    }, [date])

    const selectedDay = (val: any) => {
      setDate(val)
    };

  return (
    <div className='popupout'>
      <div className="popupbox">
        <button className="close" 
          onClick={() => {
            setShowWeightGainPopup(false)
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

        <TextField type='number' id="outlined-basic" label="Weight (in Kg)" variant="outlined" color="warning" 
          onChange={(e) => {
            setWeightGain({
              ...WeightGain,
              weightInKg: e.target.value
            })
          }}
        />

        <Button variant="contained" color="warning" onClick={saveWeightGain}>Save</Button>

        <div className='hrline'></div>
        <div className='items'>
          {
            items.map((item: any) => {
              return(
                <div className="item">
                  <h3>{item.weight} Kg</h3>
                  <h3>{item.date}</h3>
                  <button 
                   onClick={() => {
                    deleteWeightGain(item)
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

export default WeightGainPopup
