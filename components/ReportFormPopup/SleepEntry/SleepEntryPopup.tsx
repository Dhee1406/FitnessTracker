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

interface SleepEntryPopupProps {
    setShowSleepEntryPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const SleepEntryPopup: React.FC<SleepEntryPopupProps> = ({ setShowSleepEntryPopup }) => {
    const color = "#ffc20e"

    const [date, setDate] = React.useState<any>(dayjs(new Date()))
    const [time, setTime] = React.useState<any>(dayjs(new Date()))

    const [SleepEntry, setSleepEntry] = React.useState<any>({
        date: '',
        durationInHrs: ''
    })

    const [items, setItems] = React.useState<any>([])

    const saveSleepEntry = async () => {
      let tempdate = date.format('YYYY-MM-DD')
      // let temptime = time.format('HH:mm:ss')
      // let tempdatetime = tempdate + ' ' + temptime
      let finaldatetime = new Date(tempdate) 
      
      console.log(finaldatetime)

      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/addsleepentry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/JSON',
        },
        credentials: 'include',
        body: JSON.stringify({
          date: finaldatetime,
          durationInHrs: SleepEntry.durationInHrs
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.ok) {
          toast.success('success adding sleep')
          getSleepEntry()
        }
        else{
          toast.error('failure adding sleep')
        }
      })
      .catch((err) => {
        toast.error('error in fetching sleep')
        console.log(err)
      })

    }
    const getSleepEntry = async () => {
      setItems([])
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/getsleepbydate', {
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
          console.log(data.data, 'sleep data for date')
          setItems(data.data)
        }
        else {
          toast.error('Error in getting slept duration')
        }
      })
      .catch(err => {
        toast.error('Error in getting slept duration')
        console.log(err)
      })
    }

    const deleteSleepEntry = async (item: any) => {
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/deletesleepentry', {
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
          toast.success('Sleep duration item deleted successfully')
          getSleepEntry()
        }
        else{
          toast.error('Error in deleting Sleep duration')
        }
      })
      .catch(err => {
        toast.error('Error in deleting Sleep duration')
        console.log(err)
      })
    }

    React.useEffect(() => {
        getSleepEntry()
    }, [date])

    const selectedDay = (val: any) => {
      setDate(val)
    };

  return (
    <div className='popupout'>
      <div className="popupbox">
        <button className="close" 
          onClick={() => {
            setShowSleepEntryPopup(false)
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

        <TextField type='number' id="outlined-basic" label="Slept duration(in hrs)" variant="outlined" color="warning" 
          onChange={(e) => {
            setSleepEntry({
              ...SleepEntry,
              durationInHrs: e.target.value
            })
          }}
        />

        <Button variant="contained" color="warning" onClick={saveSleepEntry}>Save</Button>

        <div className='hrline'></div>
        <div className='items'>
          {
            items.map((item: any) => {
              return(
                <div className="item">
                  <h3>{item.durationInHrs} Hours</h3>
                  <h3>{item.date}</h3>
                  <button 
                   onClick={() => {
                    deleteSleepEntry(item)
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

export default SleepEntryPopup
