import { IonButton, IonContent, IonDatetime, IonIcon, IonInput, IonLabel, IonRow, IonSegment, IonSegmentButton } from "@ionic/react";
import { checkmarkCircle } from "ionicons/icons";
import { useRef, useState } from "react";
import moment from "moment";

import { Storage } from '@ionic/storage';

const ContentActivity = (props) => {

    const refModal = useRef();
    const store = new Storage();


    const [ActivityTitle, setActivityTitle] = useState(props?.defaultValues?.title);
    const [ActivityMode, setActivityMode] = useState((props?.defaultValues?.mode != undefined) ? props?.defaultValues?.mode : "classic"); //default value for mode
    const [ActivityDaySchedule, setActivityDaySchedule] = useState(null);
    const [ActivityTimer, setActivityTimer] = useState({
        hour: (props?.defaultValues?.timer?.hour == undefined) ? 0 : props?.defaultValues?.timer?.hour == undefined,
        minutes: (props?.defaultValues?.timer?.minutes==undefined)?0:props?.defaultValues?.timer?.minutes,
        seconds: (props?.defaultValues?.timer?.seconds==undefined)?0:props?.defaultValues?.timer?.seconds
    });

    function cleanInputs() {
        setActivityDaySchedule(null)
        setActivityTitle(null)
        setActivityMode("classic")
        setActivityTimer({
            hour: 0,
            minutes: 0,
            seconds: 0
        })
    }

    async function saveActivity() {
        if (ActivityTimer != null && ActivityTimer != null// && ActivityDaySchedule != null 
            && ActivityMode != null) {
            await store.create();
            let activities = await store.get('activities');

            if (activities == null) {
                activities = {}
            }
            activities[ActivityTitle] = {
                "Title": ActivityTitle,
                "Timer": ActivityTimer,
                "DaySchedule": ActivityDaySchedule,
                "Mode": ActivityMode
            }
            await store.set('activities', activities);
            refModal?.current?.dismiss(); //close the modal
            cleanInputs();
            props?.savedActivity()
        }
    }
    return (
        <IonContent className="ion-padding">
            <br></br>
            <br></br>
            <IonRow>
                <IonLabel><b>Name:</b></IonLabel>
                <IonInput fill="outline"
                    value={ActivityTitle}
                    placeholder="What's the name of new activity?"
                    onIonInput={(ev) => setActivityTitle(ev.target.value)}
                />
            </IonRow>
            <br />
            <IonRow>
                <IonLabel><b>Mode</b>: </IonLabel>
                <IonSegment onIonChange={(ev) => { setActivityMode(ev.target.value) }}
                    value={ActivityMode}
                >
                    <IonSegmentButton value={"classic"}>Classic</IonSegmentButton>
                    <IonSegmentButton value={"timer"}>Timer</IonSegmentButton>
                </IonSegment>
            </IonRow>
            {
                (ActivityMode == 'timer') ?
                    <IonDatetime presentation="time"
                        value={moment().set({ hours: ActivityTimer.hour, minutes: ActivityTimer.minutes }).format()}
                        hourCycle="h23"
                        onIonChange={(ev) => {
                            setActivityTimer({
                                hour: parseInt(moment(ev.target.value).format("HH")),
                                minutes: parseInt(moment(ev.target.value).format("mm")),
                                seconds: 0
                            })
                        }}
                    />
                    :
                    null
            }
            <br />

            {/* <IonRow>
                <IonLabel><b>Schedule</b>: </IonLabel>
                <IonInput
                    onIonInput={(ev) => setActivityDaySchedule(ev.target.value)}
                    type="number"
                    placeholder="Repeat every # day"
                />
            </IonRow> */}
            <br />

            <IonButton expand="block"
                onClick={() => {
                    saveActivity()
                }}
                size="small"
            >
                Save new activity
                <IonIcon icon={checkmarkCircle} />
            </IonButton>
        </IonContent>

    )
}


export default ContentActivity;