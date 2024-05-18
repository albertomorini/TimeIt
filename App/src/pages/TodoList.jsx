import { IonButton, IonCardSubtitle, IonCheckbox, IonCol, IonContent, IonIcon, IonItem, IonItemDivider, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonRow, IonSearchbar } from "@ionic/react";
import { checkmarkOutline, createOutline, timeOutline, timerOutline } from "ionicons/icons";
import Timer from "../components/Timer";
import { useEffect, useRef, useState } from "react";
import { Storage } from '@ionic/storage';
import moment from "moment";
import ModalActivity from "../components/ModalActivity";

import "../theme/TodoList.css"

const TodoList = () => {
    const store = new Storage();
    const refModalTimer = useRef();
    const refModalActivity = useRef(); //for the edit modal

    const [ActivityList, setActivityList] = useState();
    const [CompletedActivity, setCompletedActivity] = useState();

    const [FilterCompleted, setFilterCompleted] = useState(false);

    const [SearchValue, setSearchValue] = useState();

    async function loadActivities() {
        await store.create();
        let activities = await store.get('activities');
        let tmp = Object.keys(activities).map(s=> activities[s])
        setActivityList(tmp);

        //Load completed
        await store.create()
        let dummy = await store.get("activities_completed");
        setCompletedActivity(dummy)
    }

    function showTimer(data, title) {
        refModalTimer?.current?.setTimer(
            (data.hour == "00") ? 0 : data.hour,
            (data.minutes == "00") ? 0 : data.minutes,
            (data.seconds == "00") ? 0 : data.seconds,
            title
        )
    }

    async function marksActivity(activityTitle) {
        
        let d = new Date();
        
        let tmpList = ActivityList;
        let activity = tmpList.find(s=> s.Title==activityTitle)
        setActivityList(null);
        
        tmpList.splice(tmpList.indexOf(activity),1); //remove it 
        
        //TODO: for manage the undone -->        //activity.Done=!activity.Done; //if done marks as undone - viceversa
        activity.Done=true; //set as done
        
        
        tmpList.push(activity) //push it at the end
        setActivityList(tmpList) 


        await store.create();
        await store.set('activities', tmpList); //remove from the storage 



        await store.create();
        let activityDone = await store.get("activities_completed"); //ActivityDone -> { title:date}
        if (activityDone == null) {
            activityDone = []
        };
        activityDone.push({
            "Title": activityTitle,
            "Date": moment().format("DD/MM/YYYY HH:mm:ss")
        })
        store.set("activities_completed", activityDone);

        loadActivities()
    }

    useEffect(() => {
        loadActivities();
    }, [])
    return (
        <>
            <br></br>
            <br></br>
            <IonContent className="ion-padding" fullscreen="true">
                <IonRow>
                    <IonCol>
                        <IonSearchbar
                            placeholder="Search activity"
                            onIonInput={(ev) => { setSearchValue(ev?.target?.value) }}
                        // mode="ios"
                        />
                    </IonCol>
                    <IonCol size="1">
                        <IonButton
                            onClick={() => { setFilterCompleted(!FilterCompleted); }}
                            color={(FilterCompleted) ? "primary" : "dark"}
                            size="small"
                            style={{
                                marginTop: "14px"
                            }}
                        >
                            <IonIcon icon={timeOutline} />
                        </IonButton>
                    </IonCol>
                </IonRow>
                {
                    (ActivityList != null) ?
                        ActivityList?.filter(s => (SearchValue != null) ? s.Title.startsWith(SearchValue) : s)
                            // .sort((a, b) => a?.Done - b?.Done)
                            .map(s => {
                                return (
                                    <IonItemSliding>
                                        <IonItem key={s?.Title}>
                                            <IonCheckbox labelPlacement="end" justify="start"
                                                checked={s?.Done ? true : null}
                                                disabled={s?.Done ? true : null}
                                                onIonChange={() => { marksActivity(s.Title) }}
                                            >
                                                {
                                                    (s?.Done) ?
                                                        <IonLabel
                                                            style={{ textDecoration: "line-through" }}
                                                        >{s?.Title}</IonLabel>
                                                        :
                                                        <IonLabel>{s?.Title}</IonLabel>
                                                }
                                            </IonCheckbox>

                                            {/* <IonCardSubtitle>Repeats every {s?.DaySchedule} days</IonCardSubtitle> */}

                                        </IonItem>

                                        <IonItemOptions side="start" onIonSwipe={() => { marksActivity(s?.Title) }}>
                                            <IonItemOption color="success" expandable
                                                onClick={() => { marksActivity(s?.Title) }}
                                            >
                                                <IonIcon slot="bottom" icon={checkmarkOutline}></IonIcon>
                                                Done
                                            </IonItemOption>
                                        </IonItemOptions>
                                        <IonItemOptions side="end" onIonSwipe={() => {
                                            if (s.Mode == 'timer') {
                                                showTimer(s.Timer, s.Title)
                                            } else {
                                                refModalActivity?.current?.editActivity(s.Title,s.Mode,s.Timer)
                                            }
                                        }}>

                                            <IonItemOption expandable
                                                onClick={() => { refModalActivity?.current?.editActivity(s.Title, s.Mode, s.Timer) }}>
                                                <IonIcon slot="bottom" icon={createOutline}></IonIcon>
                                                Edit
                                            </IonItemOption>
                                            {
                                                (s?.Mode == 'timer') ?
                                                    <IonItemOption color={"warning"}
                                                        onClick={() => { showTimer(s?.Timer, s?.Title) }}
                                                        expandable
                                                    >
                                                        <IonIcon slot="bottom" icon={timerOutline} />
                                                        Timer
                                                    </IonItemOption>
                                                    :
                                                    null
                                            }
                                        </IonItemOptions>
                                    </IonItemSliding>
                                )
                            })
                        :
                        null
                }

                {
                    (FilterCompleted) ?
                        <>
                            <IonItemDivider />
                            {CompletedActivity?.map(s => (
                                <IonItem>
                                    <IonCol>

                                        {s.Title}
                                    </IonCol>
                                    <IonCol
                                        style={{ textAlign: "right" }}
                                    >
                                        {s.Date}
                                    </IonCol>
                                </IonItem>
                            ))}
                        </>

                        :
                        null
                }

            </IonContent>
            <Timer ref={refModalTimer}
                marksActivity={(title) => marksActivity(title)}
            />
            <ModalActivity ref={refModalActivity} />
        </>


    )
};


export default TodoList;