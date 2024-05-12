import { IonButton, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonLabel, IonModal, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from "@ionic/react";
import { checkmarkCircle, closeOutline, createOutline } from "ionicons/icons";
import { useEffect, useRef, useState } from "react";

import { Storage } from '@ionic/storage';

const ModalActivity = (props) => {

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
            //TODO: check if already exists
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
        <>
            <IonButton slot="end" onClick={() => { refModal?.current?.present() }}
            >
                New
                <IonIcon icon={createOutline} slot="end" id="newActivity" />
            </IonButton>

            <IonModal trigger="newActivity" ref={refModal}>
                {/* TODO: da rimuovere il trigger, capire come gestire anche in base all'edit */}

                <IonHeader>
                    <IonToolbar>
                        <IonTitle>New activity</IonTitle>
                        <IonButton color="danger" slot="end"
                        size="small"
                            onClick={() => {
                                refModal?.current?.dismiss()
                                cleanInputs()
                            }}
                        >
                            <IonIcon icon={closeOutline} />
                        </IonButton>
                    </IonToolbar>
                </IonHeader>

                <IonContent className="ion-padding">

                    <IonRow>
                        <IonLabel><b>Name:</b></IonLabel>
                        <IonInput fill="outline"
                            placeholder="What's the name of new activity?"
                            onIonInput={(ev) => setActivityTitle(ev.target.value)}
                        />
                    </IonRow>
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
                            <div className="ion-padding-start ion-padding-end">
                                <IonRow className="ion-padding-start ion-padding-end">
                                    <IonLabel><b>How last long?</b></IonLabel>
                                </IonRow>
                                <IonRow className="ion-padding-start ion-padding-end">
                                    <IonCol>
                                        <IonInput
                                            placeholder="hh"
                                            type="number"
                                            id="hourInput"
                                            onIonInput={(ev) => {
                                                let tmp = ActivityTimer;
                                                tmp.hour = ev.target.value
                                                setActivityTimer(tmp);
                                                document.getElementById("minuteInput").setFocus()
                                            }}
                                            debounce={800}
                                        />
                                    </IonCol>
                                    <IonCol>
                                        <IonInput
                                            placeholder="mm"
                                            type="number"
                                            id="minuteInput"
                                            onIonInput={(ev) => {
                                                let tmp = ActivityTimer;
                                                tmp.minutes = ev.target.value
                                                setActivityTimer(tmp);
                                                document.getElementById("secondsInput").setFocus()
                                            }}
                                            debounce={800}
                                        />
                                    </IonCol>
                                    <IonCol>
                                        <IonInput
                                            placeholder="ss"
                                            id="secondsInput"
                                            onIonInput={(ev) => {
                                                let tmp = ActivityTimer;
                                                tmp.seconds = ev.target.value
                                                setActivityTimer(tmp);
                                            }}
                                        />
                                    </IonCol>
                                </IonRow>
                            </div>
                            :
                            null
                    }
                    <IonRow>
                        <IonLabel><b>Schedule</b>: </IonLabel>
                        <IonInput
                            onIonInput={(ev) => setActivityDaySchedule(ev.target.value)}
                            type="number"
                            placeholder="Repeat every # day"
                        />
                    </IonRow>
                    <IonButton expand="block"
                        onClick={() => {
                            saveActivity()
                        }}
                    >
                        Save new activity
                        <IonIcon icon={checkmarkCircle} />
                    </IonButton>
                </IonContent>
            </IonModal>
        </>
    )
}


export default ModalActivity;