import { IonButton, IonCardSubtitle, IonCheckbox, IonCol, IonContent, IonIcon, IonItem, IonItemDivider, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonRow, IonSearchbar } from "@ionic/react";
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
        setActivityList(activities);

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
        setActivityList(null)
        tmpList[activityTitle].Done = true
        let dummyActivity = tmpList[activityTitle]
        delete tmpList[activityTitle]


        await store.create();
        await store.set('activities', tmpList); //remove from the storage 

        tmpList[activityTitle] = dummyActivity
        setActivityList(tmpList) //TODO: why don't refresh?


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

    }

    useEffect(() => {
        loadActivities();
    }, [])
    return (
        <>
            <br></br>
            <br></br>
            <IonContent className="ion-padding">
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
                        Object.keys(ActivityList).filter(s => (SearchValue != null) ? ActivityList[s].Title.startsWith(SearchValue) : s)
                            // .sort((a, b) => a.Done - b.Done)
                            .map(s => {
                                return (
                                    <IonItemSliding>

                                        <IonItem key={ActivityList[s].Title}>
                                            <IonCheckbox labelPlacement="end" justify="start"
                                                checked={ActivityList[s].Done ? true : null}
                                                disabled={ActivityList[s].Done ? true : null}
                                                onIonChange={() => { marksActivity(ActivityList[s].Title) }}
                                            >
                                                {
                                                    (ActivityList[s].Done) ?
                                                        <IonLabel
                                                            style={{ textDecoration: "line-through" }}
                                                        >{ActivityList[s].Title}</IonLabel>
                                                        :
                                                        <IonLabel>{ActivityList[s].Title}</IonLabel>
                                                }
                                            </IonCheckbox>

                                            <IonCardSubtitle>Repeats every {ActivityList[s].DaySchedule} days</IonCardSubtitle>

                                        </IonItem>

                                        <IonItemOptions side="start" onIonSwipe={() => { marksActivity(ActivityList[s].Title) }}>
                                            <IonItemOption color="success" expandable
                                                onClick={() => { marksActivity(ActivityList[s].Title) }}
                                            >
                                                <IonIcon slot="bottom" icon={checkmarkOutline}></IonIcon>
                                                Done
                                            </IonItemOption>
                                        </IonItemOptions>
                                        <IonItemOptions side="end" onIonSwipe={() => {
                                            if (ActivityList[s].Mode == 'timer') {
                                                showTimer(ActivityList[s].Timer, ActivityList[s].Title)
                                            } else {
                                                refModalActivity?.current?.editActivity()
                                            }
                                        }}>

                                            <IonItemOption expandable
                                                onClick={() => { refModalActivity?.current?.editActivity() }}>
                                                <IonIcon slot="bottom" icon={createOutline}></IonIcon>
                                                Edit
                                            </IonItemOption>
                                            {
                                                (ActivityList[s].Mode == 'timer') ?
                                                    <IonItemOption color={"warning"}
                                                        onClick={() => { showTimer(ActivityList[s].Timer, ActivityList[s].Title) }}
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