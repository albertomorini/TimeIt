import { IonButton, IonCol, IonContent, IonDatetime, IonHeader, IonIcon, IonInput, IonLabel, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from "@ionic/react";
import { checkmarkCircle, closeOutline } from "ionicons/icons";
import { useRef, useState } from "react";

import { Storage } from '@ionic/storage';
import ContentActivity from "../components/ContentActivity";

const NewActivity = (props) => {

    const refModal = useRef();
    const store = new Storage();


    const [ActivityTitle, setActivityTitle] = useState(null);
    const [ActivityMode, setActivityMode] = useState("classic"); //default value for mode
    const [ActivityDaySchedule, setActivityDaySchedule] = useState(null);
    const [ActivityTimer, setActivityTimer] = useState({
        hour: null,
        minutes: null,
        seconds: null
    });

    function cleanInputs() {
        setActivityDaySchedule(null)
        setActivityTitle(null)
        setActivityMode("classic")
        setActivityTimer({
            hour: null,
            minutes: null,
            seconds: null
        })
    }

    async function saveActivity() {
        if (ActivityTimer != null && ActivityTimer != null && ActivityDaySchedule != null && ActivityMode != null) {
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
        <IonContent>
            <ContentActivity
                savedActivity={() => props?.returnToList()}
            />
        </IonContent>
    )
}


export default NewActivity;