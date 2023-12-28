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

interface CaloriIntakePopupProps {
  setShowCalorieIntakePopup: React.Dispatch<React.SetStateAction<boolean>>;
}  

const CalorieIntakePopup: React.FC<CaloriIntakePopupProps> = ({ setShowCalorieIntakePopup }) => {
  const color = '#ffc20e'

  const [date, setDate] = React.useState<any>(dayjs(new Date()))
  const [time, setTime] = React.useState<any>(dayjs(new Date()))

  const [CalorieIntake, setCalorieIntake] = React.useState<any>({
    item: '',
    date: '',
    quantity: '',
    quantitytype: 'g'
  })

  const [items, setItems] = React.useState<any>([])

  const saveCalorieIntake = async () => {
    let tempdate = date.format('YYYY-MM-DD')
    let temptime = time.format('HH:mm:ss')
    let tempdatetime = tempdate + ' ' + temptime
    let finaldatetime = new Date(tempdatetime)

    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/addcalorieintake', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('get-token') || ''
      },
      credentials: 'include',
      body: JSON.stringify({
        item: CalorieIntake.item,
        date: finaldatetime,
        quantity: CalorieIntake.quantity,
        quantitytype: CalorieIntake.quantitytype
      })
    })
    .then(res => res.json())
    .then(data => {
      if(data.ok) {
        toast.success('calorie intake added successfully')
        getCalorieIntake()
      }
      else{
        toast.error('error in adding calorie intake')
      }
    })
    .catch(err => {
      toast.error('Error in adding calorie intake')
      console.log(err)
    })

    console.log(finaldatetime+'finaldatetime')
  }
  const getCalorieIntake = async () => {
    setItems([])
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/getcalorieintakebydate', {
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
        console.log(data.data, 'calorie intake data for date')
        setItems(data.data)
      }
      else {
        toast.error('Error in getting calorie intake')
      }
    })
    .catch(err => {
      toast.error('Error in getting calorie intake')
      console.log(err)
    })
  }
  const deleteCaloreIntake = async (item : any) => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/deletecalorieintake', {
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
        toast.success('Calorie intake item deleted successfully')
        getCalorieIntake()
      }
      else{
        toast.error('Error in deleting calorie intake')
      }
    })
    .catch(err => {
      toast.error('Error in deleting calorie intake')
      console.log(err)
    })
  }

  React.useEffect(() => {
    getCalorieIntake()
  }, [date])

  const selectedDay = (val: any) => {
    setDate(val)
  };

  

  // const selectedDay = (val: any) => {
  //     console.log(val)
  // };
  // const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17T15:30'));

    return (
    <div className='popupout'>
      <div className="popupbox">
        <button className="close" 
          onClick={() => {
            setShowCalorieIntakePopup(false)
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

        <TextField id="outlined-basic" label="Food item name" variant="outlined" color="warning" 
          onChange={(e) => {
            setCalorieIntake({
              ...CalorieIntake,
              item: e.target.value
            })
          }}
        />
        <TextField type='number' id="outlined-basic" label="Food item amount(in gms)" variant="outlined" color="warning" 
          onChange={(e) => {
            setCalorieIntake({
              ...CalorieIntake,
              quantity: e.target.value
            })
          }}
        />

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
        
        <Button variant="contained" color="warning" onClick={saveCalorieIntake}>Save</Button>

        <div className='hrline'></div>
        <div className='items'>
          {
            items.map((item: any) => {
              return(
                <div className="item">
                  <h3>{item.item}</h3>
                  <h3>{item.quantity} {item.quantitytype}</h3>
                  <h3>{item.calorieIntake} calorie</h3>
                  <button 
                   onClick={() => {
                    deleteCaloreIntake(item)
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

export default CalorieIntakePopup
