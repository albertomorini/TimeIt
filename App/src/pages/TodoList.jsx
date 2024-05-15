import { IonButton, IonCardSubtitle, IonCheckbox, IonCol, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonRow, IonSearchbar, IonTitle, IonToolbar } from "@ionic/react";
import { checkmarkOutline, createOutline, filterOutline, timerOutline } from "ionicons/icons";
import Timer from "../components/Timer";
import { useEffect, useRef, useState } from "react";
import { Storage } from '@ionic/storage';
import moment from "moment";
import ModalActivity from "../components/ModalActivity";

const TodoList = () => {
    const store = new Storage();
    const refModalTimer = useRef();
    const refModalActivity= useRef(); //for the edit modal

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

    function showTimer(data) {
        console.log(data);

        refModalTimer?.current?.setTimer(
            (data.hour == "00") ? 0 : data.hour,
            (data.minutes == "00") ? 0 : data.minutes,
            (data.seconds == "00") ? 0 : data.seconds,
        )
    }

    async function marksActivity(activityTitle) {
        console.log(activityTitle);
        let d = new Date();

        //TODO: when timer ends marks the activity as completed

        //TODO: when it's done change the color just in the state ~~ on refresh will be removed and shown just on the history

        //TODO: manage the undo

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
                        />
                    </IonCol>
                    <IonCol size="1">
                        <IonButton
                            onClick={() => { setFilterCompleted(!FilterCompleted); }}
                            color={(FilterCompleted) ? "primary" : "dark"}
                        >
                            <IonIcon icon={filterOutline} />
                        </IonButton>
                    </IonCol>
                </IonRow>
                {
                    (ActivityList != null) ?
                        Object.keys(ActivityList).filter(s => (SearchValue != null) ? ActivityList[s].Title.startsWith(SearchValue) : s).map(s => {
                            return (
                                <IonItemSliding>

                                    <IonItem>
                                        <IonCheckbox labelPlacement="end" justify="start"
                                            onIonChange={() => { marksActivity(ActivityList[s].Title) }}
                                        >
                                            <IonLabel>{ActivityList[s].Title}</IonLabel>
                                        </IonCheckbox>

                                        <IonCardSubtitle>Repeats every {ActivityList[s].DaySchedule} days</IonCardSubtitle>

                                    </IonItem>
                                    {/* {
                                            (ActivityList[s].Mode=='timer')?
                                            <IonRow>
                                                <br/>
                                                <IonButton>Start timer 
                                                    <IonIcon icon={playOutline}/>
                                                </IonButton>
                                            </IonRow>
                                            :
                                            null
                                        } */}

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
                                            showTimer(ActivityList[s].Timer)
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
                                                    onClick={() => { showTimer(ActivityList[s].Timer) }}
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

                {//TODO: show completed
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
            <Timer ref={refModalTimer} />
            <ModalActivity ref={refModalActivity} />
        </>


    )
};


export default TodoList;