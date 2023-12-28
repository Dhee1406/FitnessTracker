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

interface StepsTrackPopupProps {
    setShowStepsPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const StepsTrackPopup: React.FC<StepsTrackPopupProps> = ({ setShowStepsPopup }) => {
    const color = "#ffc20e"

    const [date, setDate] = React.useState<any>(dayjs(new Date()))
    const [time, setTime] = React.useState<any>(dayjs(new Date()))

    const [StepTrack, setStepTrack] = React.useState<any>({
        date: '',
        steps: ''
    })

    const [items, setItems] = React.useState<any>([])

    const saveStepTrack = async () => {
      let tempdate = date.format('YYYY-MM-DD')
      let temptime = time.format('HH:mm:ss')
      let tempdatetime = tempdate + ' ' + temptime
      let finaldatetime = new Date(tempdatetime) 
      
      console.log(finaldatetime)

      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/addstepentry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/JSON',
        },
        credentials: 'include',
        body: JSON.stringify({
          date: finaldatetime,
          steps: StepTrack.steps
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.ok) {
          toast.success('success adding steps')
          getStepTrack()
        }
        else{
          toast.error('failure adding steps')
        }
      })
      .catch((err) => {
        toast.error('error in fetching steps')
        console.log(err)
      })

    }
    const getStepTrack = async () => {
      setItems([])
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/getstepsbydate', {
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
          console.log(data.data, 'step data for date')
          setItems(data.data)
        }
        else {
          toast.error('Error in getting steps')
        }
      })
      .catch(err => {
        toast.error('Error in getting steps')
        console.log(err)
      })
    }

    const deleteStepTrack = async (item: any) => {
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/deletestepentry', {
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
          toast.success('Steps data deleted successfully')
          getStepTrack()
        }
        else{
          toast.error('Error in deleting Steps data')
        }
      })
      .catch(err => {
        toast.error('Error in deleting Steps data')
        console.log(err)
      })
    }

    React.useEffect(() => {
        getStepTrack()
    }, [date])

    const selectedDay = (val: any) => {
      setDate(val)
    };

  return (
    <div className='popupout'>
      <div className="popupbox">
        <button className="close" 
          onClick={() => {
            setShowStepsPopup(false)
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

        <TextField type='number' id="outlined-basic" label="Steps Walked(in count)" variant="outlined" color="warning" 
          onChange={(e) => {
            setStepTrack({
              ...StepTrack,
              steps: e.target.value
            })
          }}
        />

        <Button variant="contained" color="warning" onClick={saveStepTrack}>Save</Button>

        <div className='hrline'></div>
        <div className='items'>
          {
            items.map((item: any) => {
              return(
                <div className="item">
                  <h3>{item.steps} Steps</h3>
                  <h3>{item.date}</h3>
                  <button 
                   onClick={() => {
                    deleteStepTrack(item)
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

export default StepsTrackPopup
