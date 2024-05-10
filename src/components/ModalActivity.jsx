import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonLabel, IonModal, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from "@ionic/react";
import { checkmarkCircle, closeOutline, createOutline } from "ionicons/icons";
import { useRef } from "react";


const ModalActivity = (props) => {

    const refModal = useRef();

    return (
        <>
            <IonButton slot="end" onClick={()=>{refModal?.current?.present()}}
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
                            onClick={() => { refModal?.current?.dismiss() }}
                        >
                            <IonIcon icon={closeOutline} />
                        </IonButton>
                    </IonToolbar>
                </IonHeader>

                <IonContent>

                    <IonRow>
                        <IonLabel>Name:</IonLabel>
                        <IonInput fill="outline"
                            placeholder="What's the name of new activity?"
                        />
                    </IonRow>
                    <IonRow>
                        <IonLabel>Mode: </IonLabel>
                        <IonSegment>
                            <IonSegmentButton>Classic</IonSegmentButton>
                            <IonSegmentButton>Timer</IonSegmentButton>
                        </IonSegment>
                    </IonRow>
                    <IonRow>
                        <IonLabel>Schedule: </IonLabel>
                        <IonInput
                            type="number"
                            placeholder="Repeat every # day"
                        />
                    </IonRow>
                    <IonButton expand="block">
                        Save new activity
                        <IonIcon icon={checkmarkCircle} />
                    </IonButton>
                </IonContent>
            </IonModal>
        </>
    )
}



export default ModalActivity;