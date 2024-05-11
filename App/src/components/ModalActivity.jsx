import { IonButton, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonLabel, IonModal, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from "@ionic/react";
import { checkmarkCircle, closeOutline, createOutline } from "ionicons/icons";
import { useRef, useState } from "react";


const ModalActivity = (props) => {

    const refModal = useRef();

    const [ActivityTitle, setActivityTitle] = useState(null);
    const [ActivityMode, setActivityMode] = useState(null);
    const [ActivityDaySchedule, setActivityDaySchedule] = useState(null);
    const [ActivityTimer, setActivityTimer] = useState({
        hour: null,
        minutes: null,
        seconds: null
    });

    function cleanInputs() {
        setActivityDaySchedule(null)
        setActivityTitle(null)
        setActivityMode(null)
        setActivityTimer({
            hour: null,
            minutes: null,
            seconds: null
        })
    }

    function saveActivity() {
        //TODO: save into storage
        //TODO- watchout title must be identity
        console.log(ActivityTimer)
        console.log(ActivityTitle)
        console.log(ActivityDaySchedule)
        console.log(ActivityMode)
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
                        <IonLabel>Name:</IonLabel>
                        <IonInput fill="outline"
                            placeholder="What's the name of new activity?"
                            onIonInput={(ev) => setActivityTitle(ev.target.value)}
                        />
                    </IonRow>
                    <IonRow>
                        <IonLabel>Mode: </IonLabel>
                        <IonSegment onIonChange={(ev) => { setActivityMode(ev.target.value) }}>
                            <IonSegmentButton value={"classic"}>Classic</IonSegmentButton>
                            <IonSegmentButton value={"timer"}>Timer</IonSegmentButton>
                        </IonSegment>
                    </IonRow>
                    {
                        (ActivityMode == 'timer') ?
                            <IonRow>
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
                            :
                            null
                    }
                    <IonRow>
                        <IonLabel>Schedule: </IonLabel>
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