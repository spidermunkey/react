
import { CalendarTabs } from './tabs/tab_data';
import { Header } from './Header';
import { DateTime } from "../../utils/DateTime";
import { useState,useRef, useEffect, createContext , useContext } from "react";

import { TabModal } from './TabModal';
import { CalendarCursor } from "./CalendarCursor";
import { Days } from "./Days";
import { useAppState } from "context";

const Calendar = () => {
  const state = useAppState();

  const [activeTab, setActiveTab] = useState(0);
  const { birthdays, today } = state;
  const { month, year } = today;

  const [currentMonth,setMonth] = useState(month);
  const [activeBirthdays,setActiveBirthdays] = useState([]);
  const [bdays,setBdays] = useState([]);

  const updateCurrentMonth = (month) => {
    setMonth(month);
    state.currentMonth = month;
  }
  const refreshBirthdays = () => {
    const getData = async () => {
      const data = await birthdays.data
      const isToday = await birthdays.isToday();
      const isThisMonth = await birthdays.isThisMonth();
      console.log(isToday.length + ' birthdays today');
      console.log(isThisMonth.length + ' birthdays this month')
      setBdays(data)
      updateBirthdaysThisMonth()
    }
    getData()
  }
  const removeBirthday = (data) => {
    const remove = async () => {
      await state.birthdays.remove(data);
      const updated = await state.birthdays.getData();
      setBdays(updated)
    }
    remove()
  }
  const addBirthday = ({name,day,month,year}) => {
    birthdays.add({name,day,month,year}).then(res => {
      refreshBirthdays();
  })

  }
  const thisMonth = useRef(today.month).current
  const tabs = CalendarTabs;
  const toggleNext = () => updateCurrentMonth(currentMonth + 1)
  const togglePrev = () => updateCurrentMonth(currentMonth - 1)
  const toggleCurrent = () => updateCurrentMonth(thisMonth)
  
  const updateBirthdaysThisMonth = () => {
    const update = async () => setActiveBirthdays(await birthdays.getByMonth(currentMonth)) 
    update();
  }
  const handleDashboardClick = async (event) => {
    const dayElement = event.target.closest('.day')
    if (dayElement) {
      const day = dayElement.getAttribute('day')
      setActiveTab(3)
      state.currentDay = day;
      const dayData = await state.dayData(day)
    }
  }

  useEffect(updateBirthdaysThisMonth,[currentMonth])

  return (
        <>
          <div className="app">
            <div className="calendar">
              <Header></Header>
              <div className="cal-month" onClick={handleDashboardClick}>
                <div className="cal-month-header">
                  <CalendarCursor currentMonth={ DateTime.month(currentMonth) } next={toggleNext} prev={togglePrev} reset={toggleCurrent}/>
                  <div className="tabber-labels">
                    { tabs.map((tab,index) => {
                      if (tab.buttonType === 'inline'){
                        return ( 
                        <div 
                          className={`tabber-tab text-[18px] ${tab.element == tabs[activeTab]?.element ? 'active': ""}`} 
                          key={index} 
                          onClick={() => setActiveTab(index)}> 
                            <div className="icon">{tab.icon}</div>
                            <div className="tool-tip">{tab.label}</div> 
                          </div>)
                      }})
                    }
                  </div>
                </div>
                  <Days activeBirthdays={activeBirthdays} month={month} year={year} />
              </div>
            </div>
              <TabModal> { tabs[activeTab].element({currentMonth:currentMonth,birthdays:bdays,update:refreshBirthdays,remove:removeBirthday,add:addBirthday}) } </TabModal>
          </div>
        </>
  )
}

export default Calendar

