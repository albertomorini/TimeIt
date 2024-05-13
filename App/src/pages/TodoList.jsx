import { IonCardSubtitle, IonCheckbox, IonContent, IonHeader, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonTitle, IonToolbar } from "@ionic/react";
import { checkmarkOutline, createOutline, timerOutline } from "ionicons/icons";
import ModalActivity from "../components/ModalActivity";
import Timer from "../components/Timer";
import { useEffect, useRef, useState } from "react";
import { Storage } from '@ionic/storage';
import moment from "moment";

const TodoList = () => {
    const store = new Storage();
    const refModalTimer = useRef();

    const [ActivityList, setActivityList] = useState();

    async function loadActivities() {
        await store.create();
        let activities = await store.get('activities');
        setActivityList(activities)
    }

    function showTimer(data){
        console.log(data);
        
        refModalTimer?.current?.setTimer(
            (data.hour=="00")?0:data.hour,
            (data.minutes == "00") ? 0 : data.minutes,
            (data.seconds == "00")?0: data.seconds,
        )
    }

    function marksActivity(activityTitle){
        console.log(activityTitle);
        let d = new Date();

        //TODO: when timer ends marks the activity as completed
        console.log(d.getUTCDay()+"/"+(d.getUTCMonth()+1)+"/"+d.getUTCFullYear());
        console.log(moment().format("DD/MM/YYYY"));
        
    }

    useEffect(() => {
        loadActivities()
        // showTimer({
        //     hour:0,
        //     minutes: 1,
        //     seconds: 3
        // })
    }, [])
    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Time It</IonTitle>
                    <ModalActivity
                        savedActivity={() => loadActivities()}
                    />
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">

                {
                    (ActivityList != null) ?
                        Object.keys(ActivityList).map(s => {
                            return (
                                <IonItemSliding>


                                    <IonItem>

                                        <IonCheckbox labelPlacement="end" justify="start"
                                        onIonChange={()=>{marksActivity(ActivityList[s].Title)}}
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

                                    <IonItemOptions side="start">
                                        <IonItemOption color="success" >
                                            <IonIcon slot="bottom" icon={checkmarkOutline}></IonIcon>
                                            Done
                                        </IonItemOption>
                                    </IonItemOptions>
                                    <IonItemOptions side="end">
                                        {
                                            (ActivityList[s].Mode == 'timer') ?
                                                <IonItemOption color={"warning"}
                                                onClick={()=>{showTimer(ActivityList[s].Timer)}}
                                                >
                                                    <IonIcon slot="bottom" icon={timerOutline} />
                                                    Timer
                                                </IonItemOption>
                                                :
                                                null
                                        }
                                        <IonItemOption expandable
                                            onClick={() => { console.log("OKOK") }}>
                                            <IonIcon slot="bottom" icon={createOutline}></IonIcon>
                                            Edit
                                        </IonItemOption>

                                    </IonItemOptions>
                                </IonItemSliding>
                            )
                        })
                        :
                        null
                }

            </IonContent>
            <Timer ref={refModalTimer}/>
        </>


    )
};


export default TodoList;